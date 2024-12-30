<script setup lang="ts">
import { AppContext, t } from "~stores";

const emit = defineEmits<{
    (e: "resetCurrentSession"): void;
    (e: "resetAllSessions"): void;
}>();

const viewer = AppContext.user;
</script>

<template>
    <div>
        <div class="grid grid-cols-[auto_1fr] gap-y-3 gap-x-5 mt-7">
            <b>{{ t("Account.LabelName") }}:</b>
            <span class="text-medium-emphasis">{{ viewer?.fullName }}</span>

            <b>{{ t("Account.LabelLogin") }}:</b>
            <span class="text-medium-emphasis">{{ viewer?.login }}</span>
        </div>

        <v-btn class="mt-10" size="small" @click.stop="emit('resetCurrentSession')">
            {{ t("Account.BtnResetCurrentSession") }}
        </v-btn>
        <br />
        <v-btn class="mt-3" size="small" @click.stop="emit('resetAllSessions')">
            {{ t("Account.BtnResetAllSessions") }}
        </v-btn>
    </div>
</template>
