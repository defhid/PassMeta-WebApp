import { type IDetailedResult, Result } from "~infra";
import { PassFileType } from "~entities/passfile";
import { t, useAppContext } from "~stores";
import { createGlobalState } from "@vueuse/shared";
import type { PassFileLocalDto, PassFileLocalStorage } from "./types";
import type { PassfileVersionDto } from "~generated/api";

interface PassFileLocalVersionDto {
    path: string;
    passFileId: number;
    version: number;
    content: ArrayBuffer;
}

const DB_NAME = "passfiles";
const DB_VERSION = 5;
const DB_TABLE_PASSFILES = "passfiles";
const DB_TABLE_VERSIONS = "versions";
const DB_INDEX_PASSFILE_ID = "ix_passfile_id";

/**
 * Use singleton passfile storage based on IndexedDB.
 */
export const usePassFileIndexedDbLocalStorage = createGlobalState((): PassFileLocalStorage => {
    if (!checkIsSupported()) {
        throw new Error("IndexedDB is not supported");
    }

    const { serverId } = useAppContext();

    if (!serverId.value) {
        throw new Error("No server id loaded for opening IndexedDB");
    }

    const db: Promise<IDBDatabase> = openDatabase(`${DB_NAME}_${serverId.value}`, DB_VERSION);

    async function loadList(): Promise<IDetailedResult<PassFileLocalDto[]>> {
        let transaction: IDBTransaction | null = null;
        try {
            transaction = (await db).transaction(DB_TABLE_PASSFILES, "readonly");
            const store = transaction.objectStore(DB_TABLE_PASSFILES);

            const list = await promiseRequest<PassFileLocalDto[]>(store.getAll());

            transaction.commit();
            return Result.success(list);
        } catch (err) {
            console.error("Failed to load passfile list from IndexedDB", err);
            transaction?.abort();
            return Result.failure<PassFileLocalDto[]>(t("PassStorage.Error"));
        }
    }

    async function saveList(list: PassFileLocalDto[]): Promise<IDetailedResult> {
        let transaction: IDBTransaction | null = null;
        try {
            transaction = (await db).transaction(DB_TABLE_PASSFILES, "readwrite");
            const store = transaction.objectStore(DB_TABLE_PASSFILES);

            await promiseRequest(store.clear());

            for (const dto of list) {
                await promiseRequest(store.add(dto));
            }

            transaction.commit();
            return Result.success(list);
        } catch (err) {
            console.error("Failed to save passfile list to IndexedDB", err);
            transaction?.abort();
            return Result.failure(t("PassStorage.Error"));
        }
    }

    async function loadEncryptedContent(
        _passFileType: PassFileType,
        passFileId: number,
        version: number,
    ): Promise<IDetailedResult<ArrayBuffer>> {
        let transaction: IDBTransaction | null = null;
        try {
            transaction = (await db).transaction(DB_TABLE_VERSIONS, "readonly");
            const store = transaction.objectStore(DB_TABLE_VERSIONS);
            const path = `${passFileId}v${version}`;

            const dto = await promiseRequest<PassFileLocalVersionDto | undefined>(store.get(path));
            transaction.commit();

            return dto ? Result.success(dto.content) : Result.failure(t("PassStorage.VersionNotFoundError"));
        } catch (err) {
            console.error(`Failed to load encrypted content #${passFileId}v${version} from IndexedDB`, err);
            transaction?.abort();
            return Result.failure<ArrayBuffer>(t("PassStorage.Error"));
        }
    }

    async function saveEncryptedContent(
        _passFileType: PassFileType,
        passFileId: number,
        version: number,
        content: ArrayBuffer,
    ): Promise<IDetailedResult> {
        let transaction: IDBTransaction | null = null;
        try {
            transaction = (await db).transaction(DB_TABLE_VERSIONS, "readwrite");
            const store = transaction.objectStore(DB_TABLE_VERSIONS);

            const path = `${passFileId}v${version}`;
            const dto: PassFileLocalVersionDto = { path, passFileId, version, content };

            await promiseRequest(store.put(dto));

            transaction.commit();
            return Result.success();
        } catch (err) {
            console.error(`Failed to save encrypted content #${passFileId}v${version} to IndexedDB`, err);
            transaction?.abort();
            return Result.failure(t("PassStorage.Error"));
        }
    }

    async function deleteEncryptedContent(passFileId: number, version: number): Promise<IDetailedResult> {
        let transaction: IDBTransaction | null = null;
        try {
            transaction = (await db).transaction(DB_TABLE_VERSIONS, "readwrite");
            const store = transaction.objectStore(DB_TABLE_VERSIONS);

            const path = `${passFileId}v${version}`;
            await promiseRequest(store.delete(path));

            transaction.commit();
            return Result.success();
        } catch (err) {
            console.error(`Failed to delete encrypted content #${passFileId}v${version} to IndexedDB`, err);
            transaction?.abort();
            return Result.failure(t("PassStorage.Error"));
        }
    }

    async function getVersions(passFileId: number): Promise<IDetailedResult<number[]>> {
        let transaction: IDBTransaction | null = null;
        try {
            transaction = (await db).transaction(DB_TABLE_VERSIONS, "readonly");
            const store = transaction.objectStore(DB_TABLE_VERSIONS);
            const index = store.index(DB_INDEX_PASSFILE_ID);

            const list = await promiseRequest<PassfileVersionDto[]>(index.getAll(passFileId));

            transaction.commit();
            return Result.success(list.map((x) => x.version));
        } catch (err) {
            console.error(`Failed to load passfile #${passFileId} version list from IndexedDB`, err);
            transaction?.abort();
            return Result.failure<number[]>(t("PassStorage.Error"));
        }
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

function checkIsSupported(): boolean {
    return window.indexedDB?.open != null;
}

async function openDatabase(name: string, version: number): Promise<IDBDatabase> {
    const request = window.indexedDB.open(name, version);

    request.onupgradeneeded = (event) => {
        const db = (event.target as typeof request).result;
        migrateDatabaseSchemaToActual(db);
    };

    return await promiseRequest(request);
}

function migrateDatabaseSchemaToActual(db: IDBDatabase) {
    if ([DB_TABLE_PASSFILES, DB_TABLE_VERSIONS].every((name) => db.objectStoreNames.contains(name))) {
        return;
    }

    if (!db.objectStoreNames.contains(DB_TABLE_PASSFILES)) {
        db.createObjectStore(DB_TABLE_PASSFILES, { keyPath: "id" as keyof PassFileLocalDto });
    }

    if (!db.objectStoreNames.contains(DB_TABLE_VERSIONS)) {
        const store = db.createObjectStore(DB_TABLE_VERSIONS, {
            keyPath: "path" as keyof PassFileLocalVersionDto,
        });

        store.createIndex(DB_INDEX_PASSFILE_ID, "passFileId", { unique: false });
    }
}

function promiseRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = function () {
            resolve(this.result);
        };
        request.onerror = function () {
            reject(this.error ?? this.result);
        };
    });
}
