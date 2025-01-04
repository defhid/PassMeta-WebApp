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
}

/**
 * Get application config.
 */
export const useAppConfig = createGlobalState((): AppConfig => {
    const isDev = import.meta.env.DEV ?? false;

    const passmetaApi =
        import.meta.env.VITE_PASSMETA_API_PROXY?.toLowerCase() === "true"
            ? "/api"
            : (import.meta.env.VITE_PASSMETA_API ?? "");

    return { isDev, passmetaApi };
});
