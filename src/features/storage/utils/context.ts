import { type PassFile, PassFileMark, PassFileType } from "~entities/passfile";
import { computed, ref, type Ref } from "vue";
import { useAppContext } from "~stores";

/**
 * A context for working with passfiles via local storage.
 */
export interface PassFileContext<TContent> {
    /**
     * Supported passfile type.
     */
    passFileType: PassFileType;

    /**
     * Current loaded list of passfiles;
     */
    currentList: Readonly<Ref<PassFile<TContent>[]>>;

    /**
     * Does current list have any change.
     */
    hasChanges: Readonly<Ref<boolean>>;

    /**
     * Load current list if it hasn't been loaded yet,
     * otherwise execute rollback.
     */
    loadList(): Promise<void>;

    /**
     * Load passfile encrypted content of its current version.
     */
    loadEncryptedContent(passFile: PassFile<TContent>): Promise<boolean>;

    /**
     * Load passfile encrypted content of its current version
     * or encrypt current decrypted content.
     */
    provideEncryptedContent(passFile: PassFile<TContent>): Promise<boolean>;

    /**
     * Create a new passfile with local id, add it to current list.
     */
    create(options: PassFileCreationOptions): PassFile<TContent>;

    /**
     * Add originPassFile to current list,
     * remove replacePassFile from current list
     * and reassign contents to the origin passfile.
     */
    add(originPassFile: PassFile<TContent>, replacePassFile?: PassFile<TContent>): boolean;

    /**
     * Mark passfile as information-changed.
     */
    updateInfo(passFile: PassFile<TContent>, fromOrigin?: boolean): boolean;

    /**
     * Mark passfile as version-changed.
     */
    updateContent(passFile: PassFile<TContent>, fromOrigin?: boolean): boolean;

    /**
     * Mark passfile as deleted.
     */
    delete(passFile: PassFile<TContent>, fromOrigin?: boolean): boolean;

    /**
     * Mark passfile as restored after local deletion.
     */
    restore(passFile: PassFile<TContent>): boolean;

    /**
     * Save current list changes.
     */
    commit(): Promise<boolean>;

    /**
     * Discard current list changes.
     */
    rollback(): void;
}

/**
 * Options for creating a new passfile.
 */
interface PassFileCreationOptions {
    /**
     * A password for new passfile.
     */
    passPhrase: string;
}

/**
 * A state of target passfile.
 */
interface PassFileState {
    /**
     * Current PassFile.
     * @remarks Empty for finally deleted.
     */
    current?: PassFile<unknown>;

    /**
     * Initial loaded passfile.
     * @remarks Empty for new.
     */
    source?: PassFile<unknown>;
}

/**
 * Options for creating a new passfile context.
 */
interface PassFileContextCreationOptions {
    /**
     * Type of passfiles.
     */
    type: PassFileType;

    /**
     * Counter for enqueue new local identifier.
     */
    localIdCounter: Ref<number>;
}

/**
 * Initialize new passfile context of specifieed type.
 * TODO: use local IndexedDB
 */
export function createPassFileContext({
    type,
    localIdCounter,
}: PassFileContextCreationOptions): PassFileContext<unknown> {
    const { currentUser } = useAppContext();

    const states = ref<PassFileState[]>([]);
    const hasChanges = ref(false);

    const currentList = computed(() => states.value.filter((x) => x.current != null).map((x) => x.current!));

    async function loadList(): Promise<void> {
        states.value = [];
    }

    function commit(): Promise<boolean> {
        states.value = currentList.value.map((current) => ({
            source: { ...current, content: { ...current.content } },
            current,
        }));

        return Promise.resolve(true);
    }

    function create({ passPhrase }: PassFileCreationOptions): PassFile<unknown> {
        const passFile: PassFile<unknown> = {
            id: ++localIdCounter.value,
            color: null,
            content: { passPhrase, decrypted: [], encrypted: undefined },
            createdOn: new Date(),
            infoChangedOn: new Date(),
            name: "",
            typeId: type,
            userId: currentUser.value!.id,
            version: 1,
            versionChangedOn: new Date(),
            mark: PassFileMark.None,
        };

        states.value.push({
            source: passFile,
            current: { ...passFile, content: { passPhrase, decrypted: [], encrypted: undefined } },
        });

        return passFile;
    }

    function rollback(): void {
        const list = states.value;

        for (let i = list.length - 1; i >= 0; --i) {
            const state = list[i];
            if (state.source == null) {
                states.value.splice(i, 1);
                continue;
            }

            state.current = {
                ...state.source!,
                content: { ...state.source!.content },
            };
        }
    }

    return {
        passFileType: type,
        currentList,
        hasChanges,
        loadList,
        create,
        commit,
        rollback,
    };
}
