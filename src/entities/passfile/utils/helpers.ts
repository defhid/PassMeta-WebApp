import type { PassFile } from "~entities/passfile";
import { reactive, toRaw } from "vue";

/**
 * Get passfile short identity string (id + name).
 */
export function getPassFileIdentityString(passFile: PassFile<unknown>): string {
    return `#${passFile.id.toString().replace("-", "~")} '${passFile.name.replace("'", "")}'`;
}

/**
 * Get title for passfile, depending on its current state.
 */
export function getPassFileTitle(passFile: PassFile<unknown>): string {
    // TODO
    return `PassFile #${passFile.id} '${passFile.name}'`;
}

/**
 * Copy information fields from <paramref name="sourcePassFile"/>.
 */
export function assignPassFileInfoFields(passFile: PassFile<unknown>, sourcePassFile: PassFile<unknown>): void {
    passFile.name = sourcePassFile.name;
    passFile.color = sourcePassFile.color;
    passFile.infoChangedOn = sourcePassFile.infoChangedOn;
}

/**
 * Copy version fields from <paramref name="sourcePassFile"/>.
 */
export function assignPassFileVersionFields(passFile: PassFile<unknown>, sourcePassFile: PassFile<unknown>): void {
    passFile.version = sourcePassFile.version;
    passFile.versionChangedOn = sourcePassFile.versionChangedOn;
}

/**
 * Is passfile created locally, but not uploaded to the server?
 */
export function isPassFileLocalCreated(passFile: PassFile<unknown>): boolean {
    return passFile.id < 0;
}

/**
 * Is passfile deleted locally, but not deleted from the server?
 */
export function isPassFileLocalDeleted(passFile: PassFile<unknown>): boolean {
    return passFile.deletedOn != null;
}

/**
 * Is passfile information changed locally, but not uploaded on the server?
 */
export function isPassFileLocalInfoFieldsChanged(passFile: PassFile<unknown>): boolean {
    return (
        passFile.originChangeStamps == null ||
        passFile.originChangeStamps.infoChangedOn.getTime() !== passFile.infoChangedOn.getTime()
    );
}

/**
 * Is passfile version changed locally, but not uploaded on the server?
 */
export function isPassFileLocalVersionFieldsChanged(passFile: PassFile<unknown>): boolean {
    return (
        passFile.originChangeStamps == null ||
        passFile.originChangeStamps.versionChangedOn.getTime() !== passFile.versionChangedOn.getTime()
    );
}

/**
 * Is passfile changed locally (created/updated/deleted), but not uploaded on the server?
 */
export function isPassFileLocalChanged(passFile: PassFile<unknown>): boolean {
    return (
        isPassFileLocalCreated(passFile) ||
        isPassFileLocalDeleted(passFile) ||
        isPassFileLocalInfoFieldsChanged(passFile) ||
        isPassFileLocalVersionFieldsChanged(passFile)
    );
}

/**
 * Make deep clone of passfile.
 */
export function clonePassFile<TContent>(passFile: PassFile<TContent>): PassFile<TContent> {
    return reactive(structuredClone(toRaw(passFile))) as PassFile<TContent>;
}
