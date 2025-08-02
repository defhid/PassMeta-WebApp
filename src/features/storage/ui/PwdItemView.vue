<script setup lang="ts">
import { t, useAppSettings } from "~stores";
import type { PwdItem } from "~entities/passfile";
import { Notify, useClipboardHelper } from "~utils";
import { isReadonly, ref, watch } from "vue";

const props = defineProps<{
    item: PwdItem;
    readonly: boolean;
}>();

const { copyTextToClipboard } = useClipboardHelper();
const settings = useAppSettings();

const hidePassword = ref(settings.hidePasswords && props.readonly);
watch(
    () => props.readonly,
    (isReadonly) => !isReadonly && (hidePassword.value = true),
);

async function copyUsername() {
    const username = props.item.usernames[0] ?? "";

    const ok = await copyTextToClipboard(username);

    ok && Notify.info(t("Storage.ItemInfo.UsernameCopied", { username }));
}

async function copyPassword() {
    const ok = await copyTextToClipboard(props.item.password);

    ok && Notify.info(t("Storage.ItemInfo.PasswordCopied"));
}
</script>

<template>
    <PmFieldset :legend="'#' + item.remark">
        <div class="flex flex-col gap-4 px-3 pt-2 pb-3">
            <PmFloatLabel variant="in">
                <PmIconField>
                    <PmInputText
                        :model-value="item.usernames.join()"
                        fluid
                        :readonly
                        @update:model-value="
                            (val) =>
                                (item.usernames =
                                    val
                                        ?.split('\n')
                                        .map((x) => x.trim())
                                        .filter((x) => x) ?? [])
                        "
                    />
                    <PmInputIcon class="pi pi-clone cursor-pointer" @click.stop="copyUsername" />
                </PmIconField>
                <label>{{ t("Storage.ItemUsernameField.Label") }}</label>
            </PmFloatLabel>

            <PmFloatLabel variant="in">
                <PmIconField>
                    <PmInputText v-model="item.password" :type="hidePassword ? 'password' : 'text'" fluid :readonly />

                    <PmInputIcon>
                        <div class="flex gap-3">
                            <i
                                class="pi cursor-pointer"
                                :class="hidePassword ? 'pi-eye-slash' : 'pi-eye'"
                                @click.stop="hidePassword = !hidePassword"
                            />
                            <i class="pi pi-clone cursor-pointer" @click.stop="copyPassword" />
                        </div>
                    </PmInputIcon>
                </PmIconField>
                <label class="justify-self-end pr-4">{{ t("Storage.ItemPasswordField.Label") }}</label>
            </PmFloatLabel>
        </div>
    </PmFieldset>
</template>
