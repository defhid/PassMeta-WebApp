import { type Ref, ref } from "vue";
import type { AppInfoDto, UserDto } from "~generated/api";
import { Notify } from "~utils";
import { createGlobalState } from "@vueuse/shared";
import type { ApiProtocol } from "~infra";

/**
 * Application context.
 */
export interface AppContext {
    /**
     * Current authenticated user info.
     */
    readonly currentUser: Ref<UserDto | undefined>;

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
}

/**
 * Use application context.
 */
export const useAppContext = createGlobalState((): AppContext => {
    const user = ref<UserDto>();
    const serverId = ref<string>();
    const serverVersion = ref<string>();
    const isContextLoaded = ref(false);
    const isContextLoading = ref(false);

    async function load(api: ApiProtocol<undefined, AppInfoDto>): Promise<void> {
        isContextLoading.value = true;

        const response = await api.silent();
        if (response.ok) {
            user.value = response.data.user ?? undefined;
            serverId.value = response.data.appId;
            serverVersion.value = response.data.appVersion;
            isContextLoaded.value = true;
        } else {
            Notify.error(response.message);
            isContextLoaded.value = false;
        }

        isContextLoading.value = false;
    }

    return {
        currentUser: user,
        serverId,
        serverVersion,
        isContextLoaded,
        isContextLoading,
        load,
    };
});
