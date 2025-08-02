<script setup lang="ts">
import { t, useAppSettings } from "~stores";
import { computed, nextTick, useId } from "vue";

const emit = defineEmits<{
    (e: "reloadRequired"): void;
}>();

const settings = useAppSettings();

const locales = computed(() => [
    { locale: "en", name: t("Settings.Lang.En") },
    { locale: "ru", name: t("Settings.Lang.Ru") },
]);

async function updateLocale(locale: string) {
    settings.locale = locale;
    await nextTick();
    emit("reloadRequired");
}

const ids = {
    locale: useId(),
    hidePasswords: useId(),
};
</script>

<template>
    <PmCard>
        <template #content>
            <div class="flex flex-col gap-5">
                <PmFloatLabel variant="in">
                    <PmSelect
                        :input-id="ids.locale"
                        class="w-full"
                        :model-value="locales.find((x) => x.locale === settings.locale)"
                        :options="locales"
                        option-label="name"
                        @update:model-value="(val) => updateLocale(val.locale)"
                    />
                    <label :for="ids.locale">{{ t("Settings.Localization") }}</label>
                </PmFloatLabel>

                <div class="flex items-center gap-3">
                    <PmCheckbox v-model="settings.hidePasswords" :input-id="ids.hidePasswords" size="large" />
                    <label :for="ids.hidePasswords">{{ t("Settings.HidePasswords") }}</label>
                </div>
            </div>
        </template>
    </PmCard>
</template>
