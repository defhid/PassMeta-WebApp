import { PassFileType } from "~entities/passfile";

/**
 * Passfile entity.
 */
export interface PassFile<TContent> {
    /**
     *  Identifier.
     */
    readonly id: number;

    /**
     * Content type.
     */
    readonly typeId: PassFileType;

    /**
     * Identifier of owner user.
     */
    readonly userId: number;

    /**
     *  Name.
     */
    name: string;

    /**
     * Distinctive color (HEX).
     */
    color: string | null;

    /**
     * Content version.
     */
    version: number;

    /**
     * Timestamp of creation.
     */
    createdOn: Date;

    /**
     * Timestamp of information change.
     */
    infoChangedOn: Date;

    /**
     * Timestamp of content change.
     */
    versionChangedOn: Date;

    /**
     * Content information.
     */
    content: PassFileContent<TContent>;
}

/**
 * Passfile entity with passwords content.
 */
export type PwdPassFile = PassFile<PwdSection[]>;

/**
 * Passfile content information.
 */
export type PassFileContent<TContent> =
    | PassFileContentEmpty
    | PassFileContentEncrypted
    | PassFileContentDecrypted<TContent>;

/**
 * Passfile content information when it's not loaded.
 */
export type PassFileContentEmpty = {
    /**
     * No decrypted content.
     */
    readonly decrypted?: undefined;

    /**
     * No encrypted content.
     */
    readonly encrypted?: undefined;

    /**
     * No secret key for encrypting/decrypting content.
     */
    readonly passphrase?: undefined;
};

/**
 * Passfile content information when it's encrypted.
 */
export type PassFileContentEncrypted = {
    /**
     * No decrypted content.
     */
    readonly decrypted?: undefined;

    /**
     * Encrypted content.
     */
    readonly encrypted: ArrayBuffer;

    /**
     * Secret key for encrypting/decrypting content.
     */
    readonly passphrase: string | undefined;
};

/**
 * Passfile content information when it's decrypted.
 */
export type PassFileContentDecrypted<TContent> = {
    /**
     * Decrypted content.
     */
    readonly decrypted: TContent;

    /**
     * No encrypted content.
     */
    readonly encrypted?: undefined;

    /**
     * Secret key for encrypting/decrypting content.
     */
    readonly passphrase: string | undefined;
};

/**
 * Password section.
 */
export interface PwdSection {
    /**
     * Section identifier.
     */
    readonly id: string;

    /**
     * Section name.
     */
    name: string;

    /**
     * Website address.
     */
    websiteUrl: string;

    /**
     * Password items.
     */
    items: PwdItem[];
}

/**
 * Password item.
 */
export interface PwdItem {
    /**
     * Username list: email, phone, etc.
     */
    usernames: string[];

    /**
     * Single password.
     */
    password: string;

    /**
     * Comment.
     */
    remark: string;
}
