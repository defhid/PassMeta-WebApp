import { createGlobalState } from "@vueuse/shared";
import { usePassFileInMemoryLocalStorage } from "./inMemoryStorage";
import { usePassFileIndexedDbLocalStorage } from "./indexedDbStorage";
import type { PassFileLocalStorage } from "./types";
export type { PassFileLocalStorage, PassFileLocalDto } from "./types";

/**
 * Use singleton passfile storage.
 */
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
