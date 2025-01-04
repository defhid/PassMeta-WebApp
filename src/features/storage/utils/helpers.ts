import { useDialogs } from "~entities/dialog";

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
