<script setup lang="ts">
import { t } from "~stores";
import { SettingsView } from "~features/settings";
</script>

<template>
    <div class="grid grid-rows-[auto_1fr] gap-6 mt-6">
        <h4 class="text-h4 text-center">{{ t("Settings.Title") }}</h4>

        <SettingsView class="justify-self-start w-full max-w-[400px]" />
    </div>
</template>
