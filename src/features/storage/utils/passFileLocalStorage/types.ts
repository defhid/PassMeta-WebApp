import type { IDetailedResult } from "~infra";
import { PassFileType } from "~entities/passfile";

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
