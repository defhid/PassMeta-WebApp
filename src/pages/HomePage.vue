<script setup lang="ts">
import { t, useAppContext } from "~stores";
import { Routes } from "~routing";

const { currentUser, serverId, serverVersion } = useAppContext();
</script>

<template>
    <div class="p-4">
        <h4 v-if="currentUser" class="text-2xl text-center mt-2 mb-7">
            {{ t("Home.TitleKnown") }},
            <RouterLink class="text-primary font-bold" :to="Routes.Account.to()">
                {{ currentUser!.fullName ?? currentUser!.login }}
            </RouterLink>
        </h4>

        <h4 v-else class="text-2xl text-center mt-2 mb-7">
            {{ t("Home.TitleUnknown") }}
            <button class="logo">
                <span class="text-surface-500">Pass</span>
                <span class="text-primary-400">Meta</span>
            </button>
        </h4>

        <div class="flex flex-col gap-7">
            <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
                <b>{{ t("Home.LabelServerId") }}:</b>
                <i class="text-medium-emphasis">{{ serverId }}</i>

                <b>{{ t("Home.LabelServerVersion") }}:</b>
                <i class="text-medium-emphasis">{{ serverVersion }}</i>
            </div>

            <div class="flex gap-4">
                <RouterLink :to="Routes.Settings.to()">
                    <PmButton
                        v-tooltip.bottom="$tooltip('Settings.Title')"
                        icon="pi pi-cog"
                        size="large"
                        rounded
                        severity="secondary"
                    />
                </RouterLink>

                <RouterLink :to="Routes.About.to()">
                    <PmButton
                        v-tooltip.bottom="$tooltip('Home.BtnAbout')"
                        icon="pi pi-info"
                        size="large"
                        severity="secondary"
                        rounded
                    />
                </RouterLink>

                <RouterLink :to="Routes.Auth.to()">
                    <PmButton
                        v-if="!currentUser"
                        v-tooltip.bottom="$tooltip('Home.BtnAuthorize')"
                        icon="pi pi-sign-in"
                        size="large"
                        rounded
                    />
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.logo {
    @apply font-black cursor-grab select-none
    active:rotate-[100turn] transition-transform duration-[100s] ease-linear;
}
</style>
