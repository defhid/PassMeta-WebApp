<script setup lang="ts">
import { t, useAppSettings } from "~stores";
import { computed, nextTick } from "vue";
import { Routes } from "~routing";
import { useRouter } from "vue-router";

const settings = useAppSettings();

const locales = computed(() => [
    { locale: "en", name: t("Settings.Lang.En") },
    { locale: "ru", name: t("Settings.Lang.Ru") },
]);

const router = useRouter();

async function updateLocale(locale: string) {
    settings.locale = locale;
    await nextTick();
    await router.replace(Routes.Settings.to());
}
</script>

<template>
    <v-card>
        <div class="p-4">
            <v-combobox
                :key="settings.locale"
                :model-value="locales.find((x) => x.locale === settings.locale)"
                :items="locales"
                item-title="name"
                :label="t('Settings.Localization')"
                @update:model-value="(val) => updateLocale(val.locale)"
            />

            <v-checkbox v-model="settings.hidePasswords" class="field-only" :label="t('Settings.HidePasswords')" />
        </div>
    </v-card>
</template>
