import { readonly, ref } from "vue";
import type { UserDto } from "~generated/api";
import { PassMetaApi } from "~api";
import { Notify } from "~utils";

const user = ref<UserDto>();
const serverId = ref<string>();
const serverVersion = ref<string>();
const isLoaded = ref(false);
const isLoading = ref(false);

async function load(): Promise<void> {
    isLoading.value = true;

    const response = await PassMetaApi.general.getInfo.silent();
    if (response.ok) {
        user.value = response.data.user ?? undefined;
        serverId.value = response.data.appId;
        serverVersion.value = response.data.appVersion;
        isLoaded.value = true;
    } else {
        Notify.error(response.message);
        isLoaded.value = false;
    }

    isLoading.value = false;
}

function setUser(currentUser: UserDto | null | undefined): void {
    user.value = currentUser ?? undefined;
}

export const AppContext = readonly({
    user,
    serverId,
    serverVersion,
    isLoaded,
    isLoading,
    load,
    setUser,
});
