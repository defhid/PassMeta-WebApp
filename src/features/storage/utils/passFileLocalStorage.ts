import { type IDetailedResult, Result } from "~infra";
import { PassFileType } from "~entities/passfile";
import { createGlobalState } from "@vueuse/shared";

/**
 * Local passfile storage.
 */
export interface PassFileLocalStorage {
    /**
     * Load actual list of local passfiles.
     */
    loadList(): Promise<IDetailedResult<PassFileLocalDto[]>>;

    /**
     * Save actual list of local passfiles.
     */
    saveList(list: PassFileLocalDto[]): Promise<IDetailedResult>;

    /**
     * Load local encrypted content by passfile id and version.
     */
    loadEncryptedContent(
        passFileType: PassFileType,
        passFileId: number,
        version: number,
    ): Promise<IDetailedResult<ArrayBuffer>>;

    /**
     * Save local encrypted content by passfile id and version.
     */
    saveEncryptedContent(
        passFileType: PassFileType,
        passFileId: number,
        version: number,
        content: ArrayBuffer,
    ): Promise<IDetailedResult>;

    /**
     * Delete local encrypted content by passfile id and version.
     */
    deleteEncryptedContent(passFileId: number, version: number): Promise<IDetailedResult>;

    /**
     * Get all locally saved versions of encrypted content by passfile id.
     */
    getVersions(passFileId: number): Promise<IDetailedResult<number[]>>;
}

/**
 * Passfile information DTO for local storage.
 */
export interface PassFileLocalDto {
    /**
     * Identifier.
     */
    id: number;

    /**
     * Identifier of owner user.
     */
    userId: number;

    /**
     * Identifier of content type.
     */
    typeId: number;

    /**
     * Name.
     */
    name: string;

    /**
     * Distinctive color (HEX).
     */
    color?: string;

    /**
     * Timestamp of creation.
     */
    createdOn: string;

    /**
     * Timestamp of deletion.
     */
    deletedOn?: string;

    /**
     * Timestamp of information change.
     */
    infoChangedOn: string;

    /**
     * Timestamp of data change.
     */
    versionChangedOn: string;

    /**
     * Content version.
     */
    version: number;

    /**
     * Information about last passfile changes from the server origin.
     */
    originChangeStamps?: Pick<PassFileLocalDto, "infoChangedOn" | "versionChangedOn" | "version">;
}

export const usePassFileLocalStorage = createGlobalState((): PassFileLocalStorage => {
    console.info("Initializing local database...");
    try {
        const indexedDbStorage = usePassFileIndexedDbLocalStorage();
        console.info("Local database initialized successfully!");
        return indexedDbStorage;
    } catch (err) {
        console.error("Failed to use local database", err);
    }

    console.info("Switching to in-memory database...");
    try {
        const inMemoryStorage = usePassFileInMemoryLocalStorage();
        console.info("In-memory database initialized successfully!");
        return inMemoryStorage;
    } catch (err) {
        console.error("Failed to use in-memory database", err);
        throw err;
    }
});

// const INDEXED_DB_NAME = "passfiles";
// const INDEXED_DB_VERSION = 1;

const usePassFileIndexedDbLocalStorage = createGlobalState((): PassFileLocalStorage => {
    // const db = window.indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);

    throw new Error("Not implemented!"); // TODO
});

const usePassFileInMemoryLocalStorage = createGlobalState((): PassFileLocalStorage => {
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
