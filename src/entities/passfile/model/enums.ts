/**
 * Passfile content types.
 */
export const enum PassFileType {
    /**
     * Password notes.
     */
    Pwd = 1,

    /**
     * Text notes.
     */
    Txt = 2,
}

/**
 * Passfile mark, abnormal state.
 * @remarks Flags.
 */
export const enum PassFileMark {
    /**
     * No marks.
     */
    None = 0,

    /**
     * Passfile needs merge with remote version.
     */
    NeedsMerge = 1 << 1,

    /**
     * Passfile is merged.
     */
    Merged = 1 << 2,

    /**
     * Passfile wasn't downloaded from the server because of some error.
     */
    DownloadingError = 1 << 3,

    /**
     * Passfile wasn't uploaded to the server because of some error.
     */
    UploadingError = 1 << 4,

    /**
     * Passfile wasn't deleted from the server because of some error.
     */
    RemoteDeletingError = 1 << 5,

    /**
     * Other passfile error.
     */
    OtherError = 1 << 6,

    /**
     * All passfile error marks.
     */
    AllErrors = DownloadingError | UploadingError | RemoteDeletingError | OtherError,
}
