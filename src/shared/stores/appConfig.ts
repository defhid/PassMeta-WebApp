import { createGlobalState } from "@vueuse/shared";

/**
 * Application config.
 */
export interface AppConfig {
    /**
     * Indicator that dev mode is enabled.
     */
    readonly isDev: boolean;

    /**
     * URL for PassMeta backend.
     */
    readonly passmetaApi: string;

    /**
     * A license key for PrimeUI.
     */
    readonly primeuiLicense: string;
}

/**
 * Get application config.
 */
export const useAppConfig = createGlobalState((): AppConfig => {
    const isDev = import.meta.env.DEV ?? false;
    const primeuiLicense = import.meta.env.VITE_PRIMEUI_LICENSE ?? "";

    return {
        isDev,
        passmetaApi: "/api",
        primeuiLicense,
    };
});
