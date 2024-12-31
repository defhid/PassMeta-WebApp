<script setup lang="ts">
import type { PwdItem, PwdSection } from "~entities/passfile";
import { normalizeExternalUrl } from "~utils";
import { t } from "~stores";

const props = defineProps<{
    section: PwdSection;
}>();

function copyUsername(item: PwdItem) {
    navigator.clipboard.writeText(item.usernames[0] ?? "");
}

function copyPassword(item: PwdItem) {
    navigator.clipboard.writeText(item.password);
}
</script>

<template>
    <div>
        <div class="flex justify-between items-center py-4">
            <h5 class="text-h5">{{ section.name }}</h5>

            <a v-if="section.websiteUrl" :href="normalizeExternalUrl(section.websiteUrl)" target="_blank">
                <v-btn variant="plain" density="compact" class="italic">{{ section.websiteUrl }}</v-btn>
            </a>
        </div>

        <div class="pt-3.5 grid gap-3.5">
            <v-card v-for="(item, i) in section.items" :key="i" variant="tonal">
                <span v-if="item.remark" class="opacity-60 block pl-3 pt-2">#{{ item.remark }}</span>

                <div class="grid grid-cols-[auto_1fr_auto] gap-y-4 items-center px-3 pt-2 pb-3">
                    <label class="justify-self-end pr-4">{{ t("Storage.ItemUsernameField.Label") }}</label>
                    <v-text-field
                        :model-value="item.usernames.join()"
                        density="compact"
                        variant="solo"
                        class="section__text-field_readonly pr-3"
                        readonly
                    />
                    <v-btn icon="mdi-content-copy" size="small" @click="copyUsername(item)" />

                    <label class="justify-self-end pr-4">{{ t("Storage.ItemPasswordField.Label") }}</label>
                    <v-text-field
                        v-model="item.password"
                        variant="solo"
                        density="compact"
                        class="section__text-field_readonly pr-3"
                        readonly
                    />
                    <v-btn icon="mdi-content-copy" size="small" @click="copyPassword(item)" />
                </div>
            </v-card>
        </div>
    </div>
</template>

<style scoped>
.section__text-field_readonly :deep(.v-input__details) {
    display: none;
}
</style>
