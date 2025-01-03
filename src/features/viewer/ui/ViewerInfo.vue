<script setup lang="ts">
import { t, useAppContext } from "~stores";
import { useSessionClose } from "~entities/backend";

const { currentUser: viewer } = useAppContext();

const { closeAllSessions, closeCurrentSession } = useSessionClose();
</script>

<template>
    <div>
        <div class="grid grid-cols-[auto_1fr] gap-y-3 gap-x-5 mt-7">
            <b>{{ t("Account.LabelName") }}:</b>
            <span class="text-medium-emphasis">{{ viewer?.fullName }}</span>

            <b>{{ t("Account.LabelLogin") }}:</b>
            <span class="text-medium-emphasis">{{ viewer?.login }}</span>
        </div>

        <v-btn class="mt-10" size="small" @click="closeCurrentSession()">
            {{ t("Account.BtnResetCurrentSession") }}
        </v-btn>
        <br />
        <v-btn class="mt-3" size="small" @click="closeAllSessions()">
            {{ t("Account.BtnResetAllSessions") }}
        </v-btn>
    </div>
</template>
