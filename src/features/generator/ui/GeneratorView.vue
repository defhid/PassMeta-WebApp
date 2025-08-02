<script setup lang="ts">
import { t } from "~stores";
import { Notify, useClipboardHelper } from "~utils";
import { reactive, ref, useId, watch } from "vue";
import { generatePassword } from "~features/generator/model";

const currentGenerated = ref("");

const fieldIds = {
    length: useId(),
    digits: useId(),
    lowercase: useId(),
    uppercase: useId(),
    special: useId(),
};

const fieldValues = reactive({
    length: 12,
    digits: true,
    lowercase: true,
    uppercase: true,
    special: true,
});

function generate() {
    currentGenerated.value = generatePassword(
        fieldValues.length,
        fieldValues.digits,
        fieldValues.lowercase,
        fieldValues.uppercase,
        fieldValues.special,
    );
}

watch(fieldValues, generate, { immediate: true });

const { copyTextToClipboard } = useClipboardHelper();

async function copyPassword() {
    const ok = await copyTextToClipboard(currentGenerated.value);

    ok && Notify.info(t("Generator.ResultCopied"));
}
</script>

<template>
    <div class="flex align-center gap-10 flex-wrap justify-center">
        <PmCard>
            <template #content>
                <div class="grid grid-cols-[auto_auto] px-2 pb-2 gap-x-6 gap-y-10 items-center">
                    <label :for="fieldIds.length">{{ t("Generator.PasswordLength") }}</label>
                    <PmInputNumber
                        v-model="fieldValues.length"
                        :input-id="fieldIds.length"
                        class="w-[135px]"
                        show-buttons
                        increment-button-icon="pi pi-plus"
                        decrement-button-icon="pi pi-minus"
                        button-layout="horizontal"
                        :step="2"
                        :min="4"
                        :max="100"
                    />

                    <label :for="fieldIds.digits">{{ t("Generator.IncludeDigits") }}</label>
                    <PmCheckbox v-model="fieldValues.digits" :input-id="fieldIds.digits" binary size="large" />

                    <label :for="fieldIds.lowercase">{{ t("Generator.IncludeLowercase") }}</label>
                    <PmCheckbox v-model="fieldValues.lowercase" :input-id="fieldIds.lowercase" binary size="large" />

                    <label :for="fieldIds.uppercase">{{ t("Generator.IncludeUppercase") }}</label>
                    <PmCheckbox v-model="fieldValues.uppercase" :input-id="fieldIds.uppercase" binary size="large" />

                    <label :for="fieldIds.special">{{ t("Generator.IncludeSpecial") }}</label>
                    <PmCheckbox v-model="fieldValues.special" :input-id="fieldIds.special" binary size="large" />
                </div>
            </template>
        </PmCard>

        <div class="flex flex-col w-[300px] gap-4">
            <PmInputText :model-value="currentGenerated" size="large" readonly />

            <div class="flex gap-5">
                <PmButton icon="pi pi-clone" size="large" variant="outlined" rounded @click.stop="copyPassword" />
                <PmButton
                    icon="pi pi-refresh"
                    size="large"
                    variant="outlined"
                    severity="secondary"
                    rounded
                    @click.stop="generate"
                />
            </div>
        </div>
    </div>
</template>
