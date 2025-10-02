<script setup lang="ts">
import { t, useAppSettings } from "~stores";
import type { PwdItem } from "~entities/passfile";
import { Notify, useClipboardHelper } from "~utils";
import { ref, watch } from "vue";

const props = defineProps<{
    item: PwdItem;
    readonly: boolean;
    canUp: boolean;
    canDown: boolean;
}>();

const emit = defineEmits<{
    delete: [];
    up: [];
    down: [];
}>();

const { copyTextToClipboard } = useClipboardHelper();
const settings = useAppSettings();

const hidePassword = ref(settings.hidePasswords && props.readonly);
watch(
    () => props.readonly,
    (isReadonly) => (hidePassword.value = isReadonly ? settings.hidePasswords : false),
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
    <PmFieldset>
        <template v-if="readonly" #legend>{{ item.remark ? "#" + item.remark : "-" }}</template>
        <template v-else #legend>
            <PmInputText v-model="item.remark" size="small" placeholder="#" />
        </template>

        <div class="flex gap-4 pl-3 pt-2 pb-3">
            <div class="flex flex-1 flex-col gap-4">
                <PmFloatLabel v-if="item.usernames.length || !readonly" variant="in">
                    <PmIconField>
                        <PmInputText
                            :model-value="item.usernames.join(', ')"
                            fluid
                            :readonly
                            @update:model-value="
                                (val) =>
                                    (item.usernames =
                                        val
                                            ?.split(',')
                                            .map((x) => x.trim())
                                            .filter((x) => x) ?? [])
                            "
                        />
                        <PmInputIcon class="pi pi-clone cursor-pointer" @click.stop="copyUsername" />
                    </PmIconField>
                    <label>{{ t("Storage.ItemUsernameField.Label") }}</label>
                </PmFloatLabel>

                <PmFloatLabel v-if="item.password || !readonly" variant="in">
                    <PmIconField>
                        <PmInputText
                            v-model="item.password"
                            :type="hidePassword ? 'password' : 'text'"
                            fluid
                            :readonly
                        />

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

            <div v-if="!readonly" class="flex flex-col gap-2 justify-center">
                <PmButton icon="pi pi-trash" severity="secondary" size="small" @click.stop="emit('delete')" />
                <PmButton
                    icon="pi pi-arrow-up"
                    severity="secondary"
                    size="small"
                    :disabled="!canUp"
                    @click.stop="emit('up')"
                />
                <PmButton
                    icon="pi pi-arrow-down"
                    severity="secondary"
                    size="small"
                    :disabled="!canDown"
                    @click.stop="emit('down')"
                />
            </div>
        </div>
    </PmFieldset>
</template>
