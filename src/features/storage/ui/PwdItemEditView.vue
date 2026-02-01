<script setup lang="ts">
import { t, useAppSettings } from "~stores";
import type { PwdItem } from "~entities/passfile";
import { Notify, useClipboardHelper } from "~utils";
import { ref } from "vue";

const props = defineProps<{
    item: PwdItem;
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
    <div>
        <div class="flex items-center gap-2">
            <label class="text-primary">#</label>
            <PmInputText v-model="item.remark" size="small" placeholder="#" />
        </div>

        <div class="flex gap-4 pt-2 pb-3">
            <div class="flex flex-1 flex-col gap-4">
                <PmFloatLabel variant="in">
                    <PmIconField>
                        <PmInputText
                            :model-value="item.usernames.join(', ')"
                            fluid
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

                <PmFloatLabel variant="in">
                    <PmIconField>
                        <PmInputText
                            v-model="item.password"
                            :type="hidePassword ? 'password' : 'text'"
                            fluid
                            variant="outlined"
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

            <div class="flex flex-col gap-2 justify-center">
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
    </div>
</template>
