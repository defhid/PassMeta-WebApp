import { useDialogs } from "~entities/dialog";
import type { PassfileDto } from "~generated/api.ts";
import { type PassFile, PassFileMark } from "~entities/passfile";

/**
 * Use helper methods for asking passphrase.
 */
export function usePassPhraseAskHelper() {
    const { askPassword } = useDialogs();

    async function askLooped(options: {
        question: string;
        repeatQuestion: string;
        validator: (result: string) => boolean | Promise<boolean>;
    }): Promise<string | null> {
        let passPhrase = await askPassword({ question: options.question });

        while (passPhrase != null && (passPhrase === "" || !(await options.validator(passPhrase)))) {
            passPhrase = await askPassword({ question: options.repeatQuestion });
        }

        return passPhrase;
    }

    return { askLooped };
}

/**
 * Map passfile DTO to model.
 */
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
        originChangeStamps: {
            infoChangedOn: dto.infoChangedOn,
            versionChangedOn: dto.versionChangedOn,
            version: dto.version,
        },
        mark: PassFileMark.None,
    };
}

/**
 * Map passfile model to DTO.
 */
export function makePassFileDto(data: PassFile<unknown>): PassfileDto {
    return {
        id: data.id,
        typeId: data.typeId,
        userId: data.userId,
        color: data.color,
        createdOn: data.createdOn,
        infoChangedOn: data.infoChangedOn,
        name: data.name,
        version: data.version,
        versionChangedOn: data.versionChangedOn,
    };
}
