<script setup lang="ts">
import type { PwdSection } from "~entities/passfile";
import { normalizeExternalUrl, useClipboardHelper } from "~utils";
import { t } from "~stores";

const props = defineProps<{
    section: PwdSection;
}>();

const emit = defineEmits<{
    (e: "back"): void;
}>();

const { copyTextToClipboard } = useClipboardHelper();
</script>

<template>
    <div class="pb-10">
        <div class="flex flex-wrap items-center py-4 gap-x-2 gap-y-5">
            <div class="grid grid-cols-[auto_auto] items-center gap-3">
                <div class="md:hidden">
                    <v-btn icon="mdi-keyboard-backspace" size="small" @click="emit('back')" />
                </div>
                <h5 class="text-h5 truncate">{{ section.name }}</h5>
            </div>

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
                        class="field-only pr-3"
                        readonly
                    />
                    <v-btn icon="mdi-content-copy" size="small" @click="copyTextToClipboard(item.usernames[0] ?? '')" />

                    <label class="justify-self-end pr-4">{{ t("Storage.ItemPasswordField.Label") }}</label>
                    <v-text-field
                        v-model="item.password"
                        variant="solo"
                        density="compact"
                        class="field-only pr-3"
                        readonly
                    />
                    <v-btn icon="mdi-content-copy" size="small" @click="copyTextToClipboard(item.password)" />
                </div>
            </v-card>
        </div>
    </div>
</template>
