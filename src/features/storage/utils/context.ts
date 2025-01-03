import { createGlobalState } from "@vueuse/shared";
import type { PassfileDto } from "~generated/api";
import { type PassFile } from "~entities/passfile";

/**
 * Use global context for working with passfiles.
 */
export const usePassFileContext = createGlobalState(() => {
    // const list:
});

export function makePassFile<TContent>(dto: PassfileDto): PassFile<TContent> {
    return {
        id: dto.id,
        typeId: dto.typeId,
        userId: dto.userId,
        color: dto.color,
        content: {},
        createdOn: dto.createdOn,
        infoChangedOn: dto.infoChangedOn,
        name: dto.name,
        version: dto.version,
        versionChangedOn: dto.versionChangedOn,
    };
}
