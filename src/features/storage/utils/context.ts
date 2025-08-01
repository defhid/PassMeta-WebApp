import {
    clonePassFile,
    encryptPassFile,
    getPassFileIdentityString,
    isPassFileLocalCreated,
    type PassFile,
    PassFileMark,
    PassFileType,
} from "~entities/passfile";
import { computed, reactive, ref, type Ref, shallowReactive, toRaw } from "vue";
import { t, useAppContext } from "~stores";
import { type PassFileLocalDto, usePassFileLocalStorage } from "~features/storage/utils/passFileLocalStorage.ts";
import { Notify } from "~utils";
import { type IResult, Result } from "~infra";
import { assert } from "@vueuse/shared";

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
    create(options: PassFileCreationOptions): Promise<IResult<PassFile<TContent>>>;

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
interface PassFileState<TContent> {
    /**
     * Current PassFile.
     * @remarks Empty for finally deleted.
     */
    current?: PassFile<TContent>;

    /**
     * Initial loaded passfile.
     * @remarks Empty for new.
     */
    source?: PassFile<TContent>;
}

/**
 * Options for creating a new passfile context.
 */
interface PassFileContextCreationOptions<TContent> {
    /**
     * Type of passfiles.
     */
    type: PassFileType;

    /**
     * Counter for enqueue new local identifier.
     */
    localIdCounter: Ref<number>;

    /**
     * Content factory for new passfiles.
     */
    contentFactory: () => TContent;
}

/**
 * Amount of passfile content versions to keep before final deletion.
 */
const KEEP_PASSFILE_VERSIONS = 5;

/**
 * Initialize new passfile context of specifieed type.
 */
export function createPassFileContext<TContent>({
    type,
    localIdCounter,
    contentFactory,
}: PassFileContextCreationOptions<TContent>): PassFileContext<TContent> {
    const { currentUser } = useAppContext();
    const pfLocalStorage = usePassFileLocalStorage();

    let initialized = false;
    const states = shallowReactive(new Map<number, PassFileState<TContent>>());
    const hasChanges = ref(false);

    const currentList = computed(() => [...states.values()].filter((x) => x.current != null).map((x) => x.current!));

    const findStateWhereCurrentIs = (passFile: PassFile<TContent>): PassFileState<TContent> | undefined => {
        const state = states.get(passFile.id);
        return toRaw(state?.current) === toRaw(passFile) ? state : undefined;
    };

    const detectChanges = () =>
        [...states.values()].some(
            (x) =>
                !x.source ||
                !x.current ||
                x.source.infoChangedOn.getTime() !== x.current.infoChangedOn.getTime() ||
                x.source.versionChangedOn.getTime() !== x.current.versionChangedOn.getTime() ||
                x.source.deletedOn?.getTime() !== x.current.deletedOn?.getTime(),
        );

    async function loadList(): Promise<void> {
        if (initialized) {
            rollback();
            return;
        }

        const result = await pfLocalStorage.loadList();
        if (result.bad) {
            unexpectedError(result.message!);
            return;
        }

        states.clear();

        for (const dto of result.data!.filter((x) => x.typeId === type)) {
            states.set(dto.id, {
                source: mapLocalDtoToPassFile(dto),
                current: mapLocalDtoToPassFile(dto),
            });
        }

        initialized = true;
        hasChanges.value = false;
    }

    async function loadEncryptedContent(passFile: PassFile<TContent>): Promise<boolean> {
        const state = findStateWhereCurrentIs(passFile);
        if (!state) {
            return unexpectedError("Not from actual state");
        }

        const result = await pfLocalStorage.loadEncryptedContent(passFile.typeId, passFile.id, passFile.version);
        if (result.bad) {
            return unexpectedError(result.message!);
        }

        state.current!.content = {
            encrypted: result.data!,
            passPhrase: passFile.content.passPhrase,
        };
        state.source!.content = { ...state.current!.content };

        return true;
    }

    async function provideEncryptedContent(passFile: PassFile<TContent>): Promise<boolean> {
        if (passFile.content.decrypted) {
            const result = await encryptPassFile(passFile);
            if (result.bad) {
                return unexpectedError(result.message!);
            }
        }

        if (passFile.content.encrypted) {
            return true;
        }

        return await loadEncryptedContent(passFile);
    }

    function create({ passPhrase }: PassFileCreationOptions): Promise<IResult<PassFile<TContent>>> {
        if (currentUser.value == null) {
            unexpectedError("Current user is not defined");
            return Promise.resolve(Result.failure());
        }

        if (!passPhrase) {
            unexpectedError("Passphrase is empty");
            return Promise.resolve(Result.failure());
        }

        const dto: PassFileLocalDto = {
            id: -++localIdCounter.value,
            color: undefined,
            createdOn: new Date().toISOString(),
            infoChangedOn: new Date().toISOString(),
            name: "",
            typeId: type,
            userId: currentUser.value!.id,
            version: 1,
            versionChangedOn: new Date().toISOString(),
        };

        const state = { current: mapLocalDtoToPassFile<TContent>(dto) };
        state.current.content = { decrypted: contentFactory(), passPhrase };

        states.set(state.current.id, state);
        hasChanges.value = true;

        return Promise.resolve(Result.success(state.current));
    }

    function add(originPassFile: PassFile<TContent>, replacePassFile?: PassFile<TContent>): boolean {
        assert(originPassFile.typeId === type);

        if (replacePassFile) {
            if (!findStateWhereCurrentIs(replacePassFile)) {
                return unexpectedError("Not from actual state");
            }

            states.delete(replacePassFile.id);
            states.set(originPassFile.id, {
                source: replacePassFile,
                current: originPassFile,
            });
        } else {
            states.set(originPassFile.id, {
                current: originPassFile,
            });
        }

        hasChanges.value = true;
        return true;
    }

    function updateInfo(passFile: PassFile<TContent>, fromOrigin?: boolean): boolean {
        const state = findStateWhereCurrentIs(passFile);
        if (!state) {
            return unexpectedError("Not from actual state");
        }

        if (fromOrigin) {
            passFile.originChangeStamps = {
                infoChangedOn: passFile.infoChangedOn,
                versionChangedOn: passFile.originChangeStamps?.versionChangedOn ?? passFile.versionChangedOn,
                version: passFile.originChangeStamps?.version ?? passFile.version,
            };
        } else {
            passFile.infoChangedOn = new Date();
        }

        hasChanges.value = true;
        return true;
    }

    function updateContent(passFile: PassFile<TContent>, fromOrigin?: boolean): boolean {
        const state = findStateWhereCurrentIs(passFile);
        if (!state) {
            return unexpectedError("Not from actual state");
        }

        if (fromOrigin) {
            passFile.originChangeStamps = {
                infoChangedOn: passFile.originChangeStamps?.infoChangedOn ?? passFile.infoChangedOn,
                versionChangedOn: passFile.versionChangedOn,
                version: passFile.version,
            };
        } else {
            passFile.versionChangedOn = new Date();

            if (state.source?.version === state.current!.version) {
                ++passFile.version;
            }
        }

        hasChanges.value = true;
        return true;
    }

    function deletePf(passFile: PassFile<TContent>, fromOrigin?: boolean): boolean {
        const state = findStateWhereCurrentIs(passFile);
        if (!state) {
            return unexpectedError("Not from actual state");
        }

        if (!state.source) {
            states.delete(passFile.id);
        } else if (isPassFileLocalCreated(state.current!) || fromOrigin) {
            state.current = undefined;
        } else {
            state.current!.deletedOn = new Date();
        }

        hasChanges.value = detectChanges();
        return true;
    }

    function restorePf(passFile: PassFile<TContent>): boolean {
        const state = findStateWhereCurrentIs(passFile);
        if (!state) {
            return unexpectedError("Not from actual state");
        }

        passFile.deletedOn = undefined;

        if (passFile.content.encrypted || passFile.content.decrypted) {
            return updateContent(passFile, false);
        }

        hasChanges.value = detectChanges();
        return true;
    }

    async function commit(): Promise<boolean> {
        if (currentUser.value == null) {
            return unexpectedError("Current user is not defined");
        }

        const toSaveList: PassFile<TContent>[] = [];
        const toSaveContent: PassFile<TContent>[] = [];
        const toDeleteContent: { passFile: PassFile<TContent>; version: number }[] = [];

        for (const state of states.values()) {
            if (state.current == null) {
                continue;
            }

            if (state.current.versionChangedOn.getTime() !== state.source?.versionChangedOn.getTime()) {
                const res = await provideEncryptedContent(state.current);
                if (!res) return res;

                toSaveContent.push(state.current);
            }

            toSaveList.push(state.current);
        }

        for (const passFile of toSaveContent) {
            const res = await pfLocalStorage.getVersions(passFile.id);
            if (res.bad) {
                unexpectedError(`${getPassFileIdentityString(passFile)}: ${res.message}`, false);
                continue;
            }

            toDeleteContent.push(
                ...res
                    .data!.sort((a, b) => b - a)
                    .slice(KEEP_PASSFILE_VERSIONS)
                    .map((version) => ({ passFile, version })),
            );
        }

        return await commitInternal(toSaveList, toSaveContent, toDeleteContent);
    }

    async function commitInternal(
        toSaveList: PassFile<TContent>[],
        toSaveContent: PassFile<TContent>[],
        toDeleteContent: { passFile: PassFile<TContent>; version: number }[],
    ): Promise<boolean> {
        for (const passFile of toSaveContent) {
            const res = await pfLocalStorage.saveEncryptedContent(
                passFile.typeId,
                passFile.id,
                passFile.version,
                passFile.content.encrypted!,
            );

            if (res.bad) {
                return unexpectedError(res.message!);
            }
        }

        for (const { passFile, version } of toDeleteContent) {
            const res = await pfLocalStorage.deleteEncryptedContent(passFile.id, version);

            if (res.bad) {
                unexpectedError(`${getPassFileIdentityString(passFile)}: ${res.message}`, false);
            }
        }

        const dtoList = toSaveList.map(mapPassFileToLocalDto);

        const result = await pfLocalStorage.saveList(dtoList);
        if (result.bad) {
            return unexpectedError(result.message!);
        }

        states.clear();
        for (const source of toSaveList) {
            states.set(source.id, {
                source,
                current: source,
            });
        }

        hasChanges.value = false;
        return true;
    }

    function rollback(): void {
        for (const [passFileId, state] of [...states.entries()]) {
            if (state.source == null) {
                states.delete(passFileId);
            } else if (state.current == null) {
                state.current = clonePassFile(state.source);
            } else {
                const clone = clonePassFile(state.source);

                if (state.source.content.encrypted && state.current.content.passPhrase) {
                    clone.content = {
                        encrypted: clone.content.encrypted!,
                        passPhrase: clone.content.passPhrase,
                    };
                }

                state.current = clone;
            }
        }

        hasChanges.value = false;
    }

    return {
        passFileType: type,
        currentList,
        hasChanges,
        loadList,
        loadEncryptedContent,
        provideEncryptedContent,
        create,
        add,
        updateInfo,
        updateContent,
        delete: deletePf,
        restore: restorePf,
        commit,
        rollback,
    };
}

function unexpectedError(log: string, show: boolean = true): false {
    console.error("PassFileContext: " + log);

    show && Notify.error(t("Passcontext.ErrOther"), { more: log });
    return false;
}

function mapLocalDtoToPassFile<TContent>(dto: PassFileLocalDto): PassFile<TContent> {
    return reactive({
        color: dto.color ?? null,
        content: {},
        createdOn: new Date(dto.createdOn),
        deletedOn: dto.deletedOn ? new Date(dto.deletedOn) : undefined,
        id: dto.id,
        infoChangedOn: new Date(dto.infoChangedOn),
        mark: PassFileMark.None,
        name: dto.name,
        originChangeStamps: dto.originChangeStamps
            ? {
                  infoChangedOn: new Date(dto.originChangeStamps.infoChangedOn),
                  versionChangedOn: new Date(dto.originChangeStamps.versionChangedOn),
                  version: dto.originChangeStamps.version,
              }
            : undefined,
        typeId: dto.typeId,
        userId: dto.userId,
        version: dto.version,
        versionChangedOn: new Date(dto.versionChangedOn),
    });
}

function mapPassFileToLocalDto(passFile: PassFile<unknown>): PassFileLocalDto {
    return {
        color: passFile.color ?? undefined,
        createdOn: passFile.createdOn.toISOString(),
        deletedOn: passFile.deletedOn?.toISOString(),
        id: passFile.id,
        infoChangedOn: passFile.infoChangedOn.toISOString(),
        name: passFile.name,
        originChangeStamps: passFile.originChangeStamps
            ? {
                  infoChangedOn: passFile.originChangeStamps.infoChangedOn.toISOString(),
                  versionChangedOn: passFile.originChangeStamps.versionChangedOn.toISOString(),
                  version: passFile.originChangeStamps.version,
              }
            : undefined,
        typeId: passFile.typeId,
        userId: passFile.userId,
        version: passFile.version,
        versionChangedOn: passFile.versionChangedOn.toISOString(),
    };
}
