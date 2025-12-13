import { t } from "~stores";
import { Notify } from "~/shared/utils/notify";

/**
 * Use helper methods for working with clipboard.
 */
export function useClipboardHelper() {
    async function copyTextToClipboard(text: string): Promise<boolean> {
        try {
            await navigator.clipboard.writeText(text);

            return true;
        } catch (err) {
            console.error("Writing to clipboard failed", err);
            Notify.error(t("Clipboard.UnknownError"));
            return false;
        }
    }

    return { copyTextToClipboard };
}
