import type { PassFile, PwdItem, PwdSection } from "~entities/passfile/model/entities";
import { type IDetailedResult, Result } from "~infra";
import { t } from "~stores";
import { PassFileType } from "~entities/passfile/model/enums";
import type { PwdItemDto, PwdSectionDto } from "~entities/passfile/model/dtos";
import { PassMetaCrypto } from "~entities/passfile";

const decryptionError = Result.failure(t("Passfile.DecryptionError"));

/**
 * Decrypt passfile content.
 * @param passFile - Passfile which data to decrypt.
 * @param passPhrase - Phrase to use for decryption.
 * @param silent - Not to write failure logs.
 */
export async function decryptPassFile<TContent>(
    passFile: PassFile<TContent>,
    passPhrase?: string,
    silent?: boolean,
): Promise<IDetailedResult> {
    passPhrase ??= passFile.content.passphrase ?? undefined;

    if (!passPhrase) {
        console.error(`Using Decrypt method without key phrase! (passfile #${passFile.id}, v${passFile.version})`);
        return decryptionError;
    }

    if (!passFile.content.encrypted) {
        console.error(`Using Decrypt method without encrypted data! (passfile #${passFile.id}, v${passFile.version})`);
        return decryptionError;
    }

    let contentBytes: ArrayBuffer;
    try {
        contentBytes = await PassMetaCrypto.decrypt(passFile.content.encrypted, passPhrase);
    } catch (err) {
        if (silent) {
            console.debug(`Silent passfile #${passFile.id} v${passFile.version} decryption failed`, err);
        } else {
            console.warn(`Passfile #${passFile.id} v${passFile.version} decryption failed`, err);
        }

        return Result.failure(t("Passfile.Validation.WrongPassphrase"));
    }

    try {
        const contentRaw = deserializePassFileContent<TContent>(passFile.typeId, contentBytes);
        passFile.content = { decrypted: contentRaw, passphrase: passPhrase };
    } catch (err) {
        console.error("Passfile deserializing failed", err);
        return decryptionError;
    }

    return Result.success();
}

const encryptionError = Result.failure(t("Passfile.EncryptionError"));

/**
 * Encrypt passfile content.
 * @param passFile - Passfile which data to encrypt.
 * @param passPhrase - Phrase to use for encryption.
 */
export async function encryptPassFile<TContent>(
    passFile: PassFile<TContent>,
    passPhrase?: string,
): Promise<IDetailedResult> {
    passPhrase ??= passFile.content.passphrase ?? undefined;

    if (!passPhrase) {
        console.error(`Using Encrypt method without key phrase! (passfile #${passFile.id}, v${passFile.version})`);
        return encryptionError;
    }

    if (!passFile.content.decrypted) {
        console.error(`Using Encrypt method without decrypted data! (passfile #${passFile.id}, v${passFile.version})`);
        return encryptionError;
    }

    let contentBytes: ArrayBuffer;
    try {
        contentBytes = serializePassFileContent(passFile.typeId, passFile.content.decrypted);
    } catch (err) {
        console.debug(`Silent passfile #${passFile.id} v${passFile.version} serializing failed`, err);
        return encryptionError;
    }

    try {
        const encryptedBytes = await PassMetaCrypto.encrypt(contentBytes, passPhrase);
        passFile.content = { encrypted: encryptedBytes, passphrase: passPhrase };
    } catch (err) {
        console.error(`Passfile #${passFile.id} v${passFile.version} encryption failed`, err);
        return encryptionError;
    }

    return Result.success();
}

/**
 * Deserialize passfile content from bytes to objects by specified type.
 */
function deserializePassFileContent<TContent>(passFileType: PassFileType, contentBytes: ArrayBuffer): TContent {
    switch (passFileType) {
        case PassFileType.Pwd: {
            const parsed = JSON.parse(new TextDecoder().decode(contentBytes));
            if (!Array.isArray(parsed)) {
                throw new Error("Content structure is invalid!");
            }

            return parsed.map(
                (section: PwdSectionDto): PwdSection => ({
                    id: section.id ?? crypto.randomUUID(),
                    name: section.nm ?? "",
                    websiteUrl: section.url ?? "",
                    items:
                        section.it?.map(
                            (item: PwdItemDto): PwdItem => ({
                                usernames: item.usr ?? [],
                                password: item.pwd ?? "",
                                remark: item.rmk ?? "",
                            }),
                        ) ?? [],
                }),
            ) as TContent;
        }
        default: {
            throw new Error("Specified content type is not supported: " + passFileType);
        }
    }
}

/**
 * Serialize passfile content to bytes.
 */
function serializePassFileContent(passFileType: PassFileType, content: any): ArrayBuffer {
    switch (passFileType) {
        case PassFileType.Pwd: {
            if (!Array.isArray(content)) {
                throw new Error("Content structure is invalid!");
            }

            const prepared = content.map(
                (section: PwdSection): PwdSectionDto => ({
                    id: section.id,
                    nm: section.name,
                    url: section.websiteUrl,
                    it: section.items.map(
                        (item: PwdItem): PwdItemDto => ({
                            usr: item.usernames,
                            pwd: item.password,
                            rmk: item.remark,
                        }),
                    ),
                }),
            );

            return new TextEncoder().encode(JSON.stringify(prepared));
        }
        default: {
            throw new Error("Specified content type is not supported: " + passFileType);
        }
    }
}
