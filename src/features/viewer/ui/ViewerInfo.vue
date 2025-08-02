<script setup lang="ts">
import { t, useAppContext } from "~stores";

const emit = defineEmits<{
    (e: "closeCurrentSession"): void;
    (e: "closeAllSessions"): void;
}>();

const { currentUser: viewer } = useAppContext();
</script>

<template>
    <div>
        <div class="grid grid-cols-[auto_1fr] gap-y-3 gap-x-5 mt-7">
            <b>{{ t("Account.LabelName") }}:</b>
            <span class="text-medium-emphasis">{{ viewer?.fullName }}</span>

            <b>{{ t("Account.LabelLogin") }}:</b>
            <span class="text-medium-emphasis">{{ viewer?.login }}</span>
        </div>

        <PmButton
            class="mt-10"
            :label="t('Account.BtnResetCurrentSession')"
            severity="secondary"
            @click.stop="emit('closeCurrentSession')"
        />

        <br />
        <PmButton
            class="mt-3"
            :label="t('Account.BtnResetAllSessions')"
            severity="secondary"
            @click.stop="emit('closeAllSessions')"
        />
    </div>
</template>
