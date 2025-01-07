<script setup lang="ts">
import { t, useAppContext } from "~stores";
import { Routes } from "~routing";
import { describeTooltip } from "~utils";

const { currentUser, serverId, serverVersion } = useAppContext();
</script>

<template>
    <div class="p-4">
        <h4 class="text-h4 text-center mt-2 mb-7">
            {{ t(currentUser ? "Home.TitleKnown" : "Home.TitleUnknown") + (currentUser ? "," : "") }}
            <RouterLink v-if="currentUser" class="text-primary font-bold" :to="Routes.Account.to()">
                {{ currentUser!.fullName ?? currentUser!.login }}
            </RouterLink>
        </h4>

        <div class="flex flex-col gap-7">
            <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
                <b>{{ t("Home.LabelServerId") }}:</b>
                <i class="text-medium-emphasis">{{ serverId }}</i>

                <b>{{ t("Home.LabelServerVersion") }}:</b>
                <i class="text-medium-emphasis">{{ serverVersion }}</i>
            </div>

            <div class="flex gap-4">
                <v-btn
                    v-tooltip="describeTooltip(t('Settings.Title'), { location: 'bottom' })"
                    icon="mdi-cog"
                    :to="Routes.Settings.to()"
                />

                <v-btn icon="mdi-information-variant" :to="Routes.About.to()" />

                <v-btn
                    v-if="!currentUser"
                    v-tooltip="describeTooltip(t('Home.BtnAuthorize'), { location: 'bottom' })"
                    icon="mdi-account-arrow-right"
                    color="primary"
                    :to="Routes.Auth.to()"
                />
            </div>
        </div>
    </div>
</template>
