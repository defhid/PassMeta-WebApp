import { type Ref, ref } from "vue";
import type { AppInfoDto, UserDto } from "~generated/api";
import { Notify } from "~utils";
import { createGlobalState } from "@vueuse/shared";
import type { ApiProtocol } from "~infra";
import { useLocalStorage } from "@vueuse/core";
import { useAppConfig } from "./appConfig";
import { useOnline } from "~api";

/**
 * Application context.
 */
export interface AppContext {
    /**
     * Current authenticated user info.
     */
    readonly currentUser: Ref<UserDto | undefined>;

    /**
     * Active UI application version.
     */
    readonly uiVersion: string;

    /**
     * Actual UI application version.
     */
    readonly uiVersionLatest: Ref<string | undefined>;

    /**
     * Connected server ID.
     */
    readonly serverId: Readonly<Ref<string | undefined>>;

    /**
     * Connected server version.
     */
    readonly serverVersion: Readonly<Ref<string | undefined>>;

    /**
     * Indicator that the context is loaded.
     */
    readonly isContextLoaded: Readonly<Ref<boolean>>;

    /**
     * Indicator that the context is loading right now.
     */
    readonly isContextLoading: Readonly<Ref<boolean>>;

    /**
     * Load/reload context.
     */
    load(api: ApiProtocol<undefined, AppInfoDto>): Promise<void>;

    /**
     * Returns a Promise that resolves when the context has loaded.
     */
    isReady(): Promise<void>;
}

/**
 * Use application context.
 */
export const useAppContext = createGlobalState((): AppContext => {
    const user = ref<UserDto>();
    const serverId = ref<string>();
    const serverVersion = ref<string>();

    const uiVersion = APP_VERSION;
    const uiVersionLatest = ref<string>();

    const isContextLoaded = ref(false);
    const isContextLoading = ref(false);

    const readyPromise = Promise.withResolvers<void>();

    const { isDev } = useAppConfig();
    const { isOnline } = useOnline();

    const localContext = useLocalStorage<AppInfoDto | null>("app-context", null, {
        serializer: {
            read: (raw: string) => (raw ? (JSON.parse(raw) as AppInfoDto) : null),
            write: (value: AppInfoDto | null) => (value ? JSON.stringify(value) : ""),
        },
    });

    function fillContext(info: AppInfoDto) {
        user.value = info.user ?? undefined;
        serverId.value = info.appId;
        serverVersion.value = info.appVersion;
        localContext.value = info;
        isContextLoaded.value = true;
    }

    localContext.value && fillContext(localContext.value);

    async function load(api: ApiProtocol<undefined, AppInfoDto>): Promise<void> {
        isContextLoading.value = true;

        try {
            const response = await api.silent();
            if (response.ok) {
                fillContext(response.data);
            } else if (isOnline.value) {
                Notify.error(response.message);
            }

            if (isOnline.value && !isDev) {
                try {
                    const response = await fetch(`/version.json?t=${Date.now()}`);
                    const data: { version: string } = await response.json();

                    uiVersionLatest.value = data.version;
                } catch (err) {
                    console.error("Failed to fetch UI version", err);
                }
            }
        } finally {
            isContextLoading.value = false;
            isContextLoaded.value && readyPromise.resolve();
        }
    }

    const isReady = () => readyPromise.promise;

    return {
        currentUser: user,
        uiVersion,
        uiVersionLatest,
        serverId,
        serverVersion,
        isContextLoaded,
        isContextLoading,
        load,
        isReady,
    };
});
