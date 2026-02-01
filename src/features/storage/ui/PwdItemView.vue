<script setup lang="ts">
import { t, useAppSettings } from "~stores";
import type { PwdItem } from "~entities/passfile";
import { Notify, useClipboardHelper } from "~utils";
import { ref } from "vue";
import KeyIcon from "~assets/icons/Key.vue";

const props = defineProps<{ item: PwdItem }>();

const { copyTextToClipboard } = useClipboardHelper();
const settings = useAppSettings();

const hidePassword = ref(settings.hidePasswords);

async function copyUsername() {
    const username = props.item.usernames[0] ?? "";

    const ok = await copyTextToClipboard(username);

    ok && Notify.success(t("Storage.ItemInfo.UsernameCopied", { username }));
}

async function copyPassword() {
    const ok = await copyTextToClipboard(props.item.password);

    ok && Notify.success(t("Storage.ItemInfo.PasswordCopied"));
}
</script>

<template>
    <div class="min-w-0">
        <div class="px-3 text-end text-primary">{{ item.remark ? "#" + item.remark : "-" }}</div>

        <div class="grid grid-cols-[auto_1fr_auto] gap-x-6 gap-y-2 pt-2 pb-3 items-center">
            <template v-if="item.usernames.length">
                <label class="unselectable text-muted-color">
                    {{ t("Storage.ItemUsernameField.Label") }}<br />
                    <span class="h-0 block invisible">{{ t("Storage.ItemPasswordField.Label") }}</span>
                </label>
                <span class="break-words min-w-0">{{ item.usernames.join(", ") }}</span>
                <PmButton
                    icon="pi pi-clone"
                    class="justify-self-end"
                    severity="secondary"
                    size="small"
                    @click.stop="copyUsername"
                />
            </template>

            <template v-if="item.password">
                <label class="unselectable text-muted-color">{{ t("Storage.ItemPasswordField.Label") }}</label>
                <template v-if="hidePassword">
                    <div class="flex flex-wrap gap-[1px]">
                        <KeyIcon
                            v-for="(_, index) in Array.from({ length: item.password.length })"
                            :key="index"
                            class="h-3 w-3 fill-primary"
                        />
                    </div>
                </template>
                <span v-else class="text-primary font-bold">{{ item.password }}</span>
                <div class="flex gap-3">
                    <PmButton
                        :icon="hidePassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                        severity="secondary"
                        variant="outlined"
                        size="small"
                        @click.stop="hidePassword = !hidePassword"
                    />
                    <PmButton icon="pi pi-clone" severity="secondary" size="small" @click.stop="copyPassword" />
                </div>
            </template>
        </div>
    </div>
</template>
