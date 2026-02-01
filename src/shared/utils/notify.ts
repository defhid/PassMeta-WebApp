import { useToast, type ToastServiceMethods } from "primevue";
import { t } from "~stores";

export interface NotifyBaseOptions {
    presenter?: "popup" | "window"; // TODO
    header?: string;
    more?: string; // TODO
    lifetime?: number;
}

let globalToast: ToastServiceMethods | null = null;

export class Notify {
    private static successQueue: { message: string; options?: NotifyBaseOptions }[] = [];

    static failure(message: string, options?: NotifyBaseOptions): void {
        globalToast?.add({
            severity: "error",
            summary: options?.header ?? t("Dialog.DefaultFailureTitle"),
            detail: message,
            life: options?.lifetime ?? 8_000,
        });
        resetFocusClose();
    }

    static error(message: string, options?: NotifyBaseOptions): void {
        globalToast?.add({
            severity: "error",
            summary: options?.header ?? t("Dialog.DefaultErrorTitle"),
            detail: message,
            life: options?.lifetime ?? 16_000,
        });
        resetFocusClose();
    }

    static warning(message: string, options?: NotifyBaseOptions): void {
        globalToast?.add({
            severity: "warn",
            summary: options?.header ?? t("Dialog.DefaultWarningTitle"),
            detail: message,
            life: options?.lifetime ?? 3_500,
        });
        resetFocusClose();
    }

    static success(message: string, options?: NotifyBaseOptions): void {
        this.successQueue.push({ message, options });

        setTimeout(this.checkSuccessQueue);
    }

    static checkSuccessQueue = () => {
        if (!this.successQueue.length) {
            return;
        }

        if (this.successQueue.length > 1 && new Set(this.successQueue.map((x) => x.options?.header || "")).size === 1) {
            globalToast?.add({
                severity: "success",
                summary: this.successQueue[0].options?.header ?? t("Dialog.DefaultSuccessTitle"),
                closable: false,
                detail: this.successQueue.map((x) => x.message).join("\n"),
                life: 1_500,
            });
        } else {
            for (const { message, options } of this.successQueue) {
                globalToast?.add({
                    severity: "success",
                    summary: options?.header ?? t("Dialog.DefaultSuccessTitle"),
                    closable: false,
                    detail: message,
                    life: options?.lifetime ?? 1_500,
                });
            }
        }

        this.successQueue.splice(0, this.successQueue.length);
        resetFocusClose();
    };
}

function resetFocusClose() {
    setTimeout(() => requestAnimationFrame(() => (document.activeElement as HTMLButtonElement)?.blur?.()));
}

export function initNotify() {
    globalToast = useToast();
}
