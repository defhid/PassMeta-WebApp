import { useToast, type ToastServiceMethods } from "primevue";
import { t } from "~stores";

export interface NotifyBaseOptions {
    presenter?: "popup" | "window"; // TODO
    header?: string;
    more?: string; // TODO
}

let globalToast: ToastServiceMethods | null = null;

export class Notify {
    static failure(message: string, options?: NotifyBaseOptions): void {
        globalToast?.add({
            severity: "error",
            summary: options?.header ?? t("Dialog.DefaultFailureTitle"),
            detail: message,
            life: 8_000,
        });
        resetFocusClose();
    }

    static error(message: string, options?: NotifyBaseOptions): void {
        globalToast?.add({
            severity: "error",
            summary: options?.header ?? t("Dialog.DefaultErrorTitle"),
            detail: message,
            life: 16_000,
        });
        resetFocusClose();
    }

    static warning(message: string, options?: NotifyBaseOptions): void {
        globalToast?.add({
            severity: "warn",
            summary: options?.header ?? t("Dialog.DefaultWarningTitle"),
            detail: message,
            life: 3_500,
        });
        resetFocusClose();
    }

    static info(message: string, options?: NotifyBaseOptions): void {
        globalToast?.add({
            severity: "info",
            summary: options?.header ?? t("Dialog.DefaultInfoTitle"),
            detail: message,
            life: 3_500,
        });
        resetFocusClose();
    }
}

function resetFocusClose() {
    setTimeout(() => (document.activeElement as HTMLButtonElement)?.blur?.());
}

export function initNotify() {
    globalToast = useToast();
}
