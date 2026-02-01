import { makePassFile, makePassFileDto, type PassFileContext } from "~features/storage";
import {
    assignPassFileInfoFields,
    assignPassFileVersionFields,
    getPassFileTitle,
    isPassFileLocalCreated,
    isPassFileLocalDeleted,
    isPassFileLocalVersionFieldsChanged,
    type PassFile,
    PassFileApi,
    PassFileMark,
    PassFileType,
} from "~entities/passfile";
import { hasFlag, Notify, usingProgress } from "~utils";
import { t } from "~stores";
import { ref } from "vue";

/**
 * Global passfile synchronization indicator.
 */
export const isPassFileSyncing = ref(false);

/**
 * Synchronize local and remote passfiles.
 */
export const synchronizePassFiles = usingProgress(
    isPassFileSyncing,
    async <TContent>(context: PassFileContext<TContent>): Promise<void> => {
        let commited = false;
        let synced = false;
        let syncWarning = false;

        if (context.hasChanges.value) {
            commited = (await context.commit()) || commited;
        } else {
            await context.loadList();
        }

        const remoteList = await PassFileApi.getList.silent({ typeId: PassFileType.Pwd });
        if (remoteList.ok) {
            syncWarning = !(await synchronizeInternal(
                context,
                context.currentList.value,
                remoteList.data.list.map(makePassFile),
            ));
            synced = true;
        }

        if (context.hasChanges.value) {
            commited = (await context.commit()) || commited;
        }

        if (commited) {
            Notify.success(t("Passcontext.InfoCommited"));
        }

        if (synced) {
            if (syncWarning) {
                Notify.failure(t("Passervice.WarnSynchronized"), { presenter: "popup" });
            } else {
                Notify.success(t("Passervice.InfoSynchronized"));
            }
        }
    },
);

async function synchronizeInternal<TContent>(
    context: PassFileContext<TContent>,
    localPassFiles: PassFile<TContent>[],
    remotePassFiles: PassFile<TContent>[],
): Promise<boolean> {
    const localList = [...localPassFiles];
    let everythingOk = true;

    for (const remote of remotePassFiles) {
        const local = localList.find((x) => x.id === remote.id);
        if (local == null) {
            everythingOk = (await onRemoteCreated(remote, context)) && everythingOk;
            continue;
        }

        local.mark &= ~PassFileMark.AllErrors;
        localList.splice(localList.indexOf(local), 1);

        if (isPassFileLocalDeleted(local)) {
            everythingOk = (await onLocalDeleted(local, remote, context)) && everythingOk;
            continue;
        }

        if (remote.infoChangedOn !== local.infoChangedOn) {
            everythingOk = (await onInfoChanged(local, remote, context)) && everythingOk;
        }

        if (remote.version !== local.version) {
            everythingOk = (await onVersionChanged(local, remote, context)) && everythingOk;
        }
    }

    for (const local of localList) {
        everythingOk =
            (isPassFileLocalCreated(local)
                ? await onLocalCreatedAsync(local, context)
                : await onRemoteDeletedAsync(local, context)) && everythingOk;
    }

    return everythingOk;
}

/**
 * Download new passfile.
 */
async function onRemoteCreated<TContent>(
    remote: PassFile<TContent>,
    context: PassFileContext<TContent>,
): Promise<boolean> {
    if (!(await tryLoadRemoteContent(remote, remote))) {
        return false;
    }

    return context.add(remote);
}

/**
 * Delete passfile finally or restore.
 */
async function onLocalDeleted<TContent>(
    local: PassFile<TContent>,
    remote: PassFile<TContent>,
    context: PassFileContext<TContent>,
): Promise<boolean> {
    // restore
    //
    if (local.infoChangedOn < remote.infoChangedOn || local.versionChangedOn < remote.versionChangedOn) {
        if (!(await tryLoadRemoteContent(local, remote))) {
            return false;
        }

        local.deletedOn = undefined;
        assignPassFileInfoFields(local, remote);

        return context.updateInfo(local, true) && context.updateContent(local, true);
    }

    // delete finally
    //
    const deleteResult = await PassFileApi.delete.silent({ id: local.id });
    if (!deleteResult.ok) {
        return context.delete(local, true);
    }

    local.mark |= PassFileMark.RemoteDeletingError;
    return false;
}

/**
 * Apply actual information changes.
 */
async function onInfoChanged<TContent>(
    local: PassFile<TContent>,
    remote: PassFile<TContent>,
    context: PassFileContext<TContent>,
): Promise<boolean> {
    if (local.infoChangedOn > remote.infoChangedOn) {
        if (!(await trySaveRemoteInfo(local))) {
            return false;
        }
    } else {
        assignPassFileInfoFields(local, remote);
    }

    return context.updateInfo(local, true);
}

/**
 * Apply actual content changes.
 */
async function onVersionChanged<TContent>(
    local: PassFile<TContent>,
    remote: PassFile<TContent>,
    context: PassFileContext<TContent>,
): Promise<boolean> {
    if (isPassFileLocalVersionFieldsChanged(local)) {
        // apply local
        //
        if (local.originChangeStamps!.version === remote.version || hasFlag(local.mark, PassFileMark.Merged)) {
            if (!(await context.provideEncryptedContent(local))) {
                return false;
            }

            if (!(await trySaveRemoteContent(local))) {
                return false;
            }

            return context.updateContent(local, true);
        }

        // may be conflicts
        //
        local.mark |= PassFileMark.NeedsMerge;
        Notify.failure(t("Passervice.WarnNeedMerge"), { header: getPassFileTitle(local) });
        return true;
    }

    // apply remote
    //
    if (!(await tryLoadRemoteContent(local, remote))) {
        return false;
    }

    return context.updateContent(local, true);
}

/**
 * Upload new passfile.
 */
async function onLocalCreatedAsync<TContent>(
    local: PassFile<TContent>,
    context: PassFileContext<TContent>,
): Promise<boolean> {
    if (!(await context.provideEncryptedContent(local))) {
        return false;
    }

    const addResult = await PassFileApi.post.silent(makePassFileDto(local));
    if (!addResult.ok) {
        local.mark |= PassFileMark.UploadingError;
        return false;
    }

    const replaceLocal = makePassFile<TContent>(addResult.data);
    replaceLocal.content = local.content;

    assignPassFileVersionFields(replaceLocal, local);

    const okAdd = context.add(replaceLocal, local);

    if (!(await trySaveRemoteContent(replaceLocal))) {
        return false;
    }

    return okAdd && context.updateContent(replaceLocal, true);
}

/**
 * Delete passfile finally.
 */
function onRemoteDeletedAsync<TContent>(
    local: PassFile<TContent>,
    context: PassFileContext<TContent>,
): Promise<boolean> {
    const ok = context.delete(local, true);
    return Promise.resolve(ok);
}

/**
 * Load passfile encrypted content from remote.
 */
async function tryLoadRemoteContent<TContent>(local: PassFile<TContent>, remote: PassFile<TContent>): Promise<boolean> {
    const result = await PassFileApi.getVersion.silent({
        passfileId: remote.id,
        version: remote.version,
    });

    if (!result.ok) {
        local.mark |= PassFileMark.DownloadingError;
        return false;
    }

    local.content = {
        encrypted: result.data,
        passPhrase: local.content.passPhrase,
    };

    assignPassFileVersionFields(local, remote);
    return true;
}

/**
 * Save passfile encrypted content to remote.
 */
async function trySaveRemoteContent(passFile: PassFile<unknown>): Promise<boolean> {
    const saveResult = await PassFileApi.postVersion.silent({
        passfileId: passFile.id,
        smth: new File([passFile.content.encrypted!], "smth"),
    });

    if (!saveResult.ok) {
        passFile.mark |= PassFileMark.UploadingError;
        return false;
    }

    assignPassFileVersionFields(passFile, makePassFile(saveResult.data));
    return true;
}

/**
 * Save passfile information to remote.
 */
async function trySaveRemoteInfo(passFile: PassFile<unknown>) {
    const saveResult = await PassFileApi.patch.silent({ id: passFile.id, color: passFile.color, name: passFile.name });

    if (!saveResult.ok) {
        passFile.mark |= PassFileMark.UploadingError;
        return false;
    }

    assignPassFileInfoFields(passFile, makePassFile(saveResult.data));
    return true;
}
