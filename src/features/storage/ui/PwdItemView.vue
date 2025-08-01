<script setup lang="ts">
import { t, useAppSettings } from "~stores";
import type { PwdItem } from "~entities/passfile";
import { useClipboardHelper } from "~utils";
import { ref } from "vue";

defineProps<{
    item: PwdItem;
}>();

const { copyTextToClipboard } = useClipboardHelper();
const settings = useAppSettings();

const hidePassword = ref(settings.hidePasswords);
</script>

<template>
    <v-card variant="tonal">
        <span v-if="item.remark" class="opacity-60 block pl-3 pt-2">#{{ item.remark }}</span>

        <div class="grid grid-cols-[auto_1fr_auto] gap-y-4 items-center px-3 pt-2 pb-3">
            <label class="justify-self-end pr-4">{{ t("Storage.ItemUsernameField.Label") }}</label>
            <v-text-field
                :model-value="item.usernames.join()"
                class="field-only pr-3"
                density="compact"
                variant="solo"
                readonly
            />
            <v-btn icon="mdi-content-copy" size="small" @click="copyTextToClipboard(item.usernames[0] ?? '')" />

            <label class="justify-self-end pr-4">{{ t("Storage.ItemPasswordField.Label") }}</label>
            <v-text-field
                v-model="item.password"
                class="field-only pr-3"
                variant="solo"
                density="compact"
                :type="hidePassword ? 'password' : 'text'"
                :append-icon="hidePassword ? 'mdi-eye-off' : 'mdi-eye'"
                readonly
                @click:append="hidePassword = !hidePassword"
            />
            <v-btn icon="mdi-content-copy" size="small" @click="copyTextToClipboard(item.password)" />
        </div>
    </v-card>
</template>
