<script setup lang="ts">
import { t, useAppContext } from "~stores";
import { Routes } from "~routing";

const { currentUser, serverId, serverVersion } = useAppContext();
</script>

<template>
    <div class="p-4">
        <h4 class="text-h4 text-center mt-2 mb-7">
            {{ t(currentUser ? "Home.TitleKnown" : "Home.TitleUnknown") }}
            <span v-if="currentUser">
                ,
                <RouterLink class="text-green" :to="Routes.Account.to()">
                    {{ currentUser!.fullName ?? currentUser!.login }}
                </RouterLink>
            </span>
        </h4>

        <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
            <b>{{ t("Home.LabelServerId") }}:</b>
            <i class="text-medium-emphasis">{{ serverId }}</i>

            <b>{{ t("Home.LabelServerVersion") }}:</b>
            <i class="text-medium-emphasis">{{ serverVersion }}</i>
        </div>

        <div v-if="!currentUser" class="mt-7">
            <v-btn size="small" :to="Routes.Auth.to()">{{ t("Home.BtnAuthorize") }}</v-btn>
        </div>
    </div>
</template>
