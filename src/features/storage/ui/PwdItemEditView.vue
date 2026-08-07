<script setup lang="ts">
import { t } from "~stores";
import type { PwdItem } from "~entities/passfile";
import { parseTotpUrl, type TotpUrl } from "~utils";

defineProps<{
    item: PwdItem;
    canUp: boolean;
    canDown: boolean;
}>();

const emit = defineEmits<{
    delete: [];
    up: [];
    down: [];
}>();
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
                    <label>{{ t("Storage.ItemUsernameField.Label") }}</label>
                </PmFloatLabel>

                <PmFloatLabel variant="in">
                    <PmInputText v-model="item.password" type="text" fluid variant="outlined" />
                    <label class="justify-self-end pr-4">{{ t("Storage.ItemPasswordField.Label") }}</label>
                </PmFloatLabel>

                <PmFloatLabel variant="in">
                    <PmInputText
                        :model-value="item.totp?.url"
                        type="text"
                        fluid
                        variant="outlined"
                        placeholder="otpauth://totp/"
                        @update:model-value="(val) => (item.totp = val ? parseTotpUrl(val as TotpUrl, false) : null)"
                    />
                    <label class="justify-self-end pr-4">{{ t("Storage.ItemTotpField.Label") }}</label>
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
