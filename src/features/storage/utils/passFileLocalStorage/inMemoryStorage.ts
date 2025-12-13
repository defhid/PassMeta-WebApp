import { createGlobalState } from "@vueuse/shared";
import { type IDetailedResult, Result } from "~infra";
import { PassFileType } from "~entities/passfile";
import type { PassFileLocalDto, PassFileLocalStorage } from "./types";

/**
 * Use singleton passfile storage based on RAM.
 */
export const usePassFileInMemoryLocalStorage = createGlobalState((): PassFileLocalStorage => {
    const storedContents = new Map<number, { version: number; content: ArrayBuffer }[]>();
    let storedList: PassFileLocalDto[] = [];

    function loadList(): Promise<IDetailedResult<PassFileLocalDto[]>> {
        return Promise.resolve(Result.success(storedList));
    }

    function saveList(list: PassFileLocalDto[]): Promise<IDetailedResult> {
        storedList = [...list];
        return Promise.resolve(Result.success());
    }

    function loadEncryptedContent(
        _passFileType: PassFileType,
        passFileId: number,
        version: number,
    ): Promise<IDetailedResult<ArrayBuffer>> {
        const found = storedContents.get(passFileId)?.find((x) => x.version === version);
        if (found) {
            return Promise.resolve(Result.success(found.content));
        }

        return Promise.resolve(Result.failure());
    }

    function saveEncryptedContent(
        _passFileType: PassFileType,
        passFileId: number,
        version: number,
        content: ArrayBuffer,
    ): Promise<IDetailedResult> {
        storedContents.set(passFileId, storedContents.get(passFileId) ?? []);
        storedContents.get(passFileId)!.push({ version, content });
        return Promise.resolve(Result.success());
    }

    function deleteEncryptedContent(passFileId: number, version: number): Promise<IDetailedResult> {
        const contents = storedContents.get(passFileId);
        if (contents) {
            const index = contents.findIndex((x) => x.version === version);
            if (index !== -1) {
                contents.splice(index, 1);
            }
        }

        return Promise.resolve(Result.success());
    }

    function getVersions(passFileId: number): Promise<IDetailedResult<number[]>> {
        const versions = storedContents.get(passFileId)?.map((x) => x.version) ?? [];
        return Promise.resolve(Result.success(versions));
    }

    return {
        loadList,
        saveList,
        loadEncryptedContent,
        saveEncryptedContent,
        deleteEncryptedContent,
        getVersions,
    };
});
