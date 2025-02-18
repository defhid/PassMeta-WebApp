<script setup lang="ts">
import { t } from "~stores";
import { useClipboardHelper } from "~utils";
import { reactive, ref, useId, watch } from "vue";
import { generatePassword } from "~features/generator/model";

const { copyTextToClipboard } = useClipboardHelper();

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
</script>

<template>
    <div class="flex flex-col align-center gap-10 sm:flex-row">
        <v-card class="w-full sm:w-auto">
            <div class="grid grid-cols-[auto_auto] px-7 py-5 gap-x-6 gap-y-4">
                <v-label :text="t('Generator.PasswordLength')" :for="fieldIds.length" />
                <v-text-field
                    :id="fieldIds.length"
                    v-model="fieldValues.length"
                    class="field-only w-[80px]"
                    step="2"
                    min="4"
                    max="100"
                    type="number"
                    variant="outlined"
                    density="compact"
                />

                <v-label :text="t('Generator.IncludeDigits')" :for="fieldIds.digits" />
                <v-checkbox :id="fieldIds.digits" v-model="fieldValues.digits" class="field-only" />

                <v-label :text="t('Generator.IncludeLowercase')" :for="fieldIds.lowercase" />
                <v-checkbox :id="fieldIds.lowercase" v-model="fieldValues.lowercase" class="field-only" />

                <v-label :text="t('Generator.IncludeUppercase')" :for="fieldIds.uppercase" />
                <v-checkbox :id="fieldIds.uppercase" v-model="fieldValues.uppercase" class="field-only" />

                <v-label :text="t('Generator.IncludeSpecial')" :for="fieldIds.special" />
                <v-checkbox :id="fieldIds.special" v-model="fieldValues.special" class="field-only" />
            </div>
        </v-card>

        <div class="flex flex-col w-[300px]">
            <v-text-field :model-value="currentGenerated" readonly variant="solo" />
            <div class="flex gap-5">
                <v-btn icon="mdi-content-copy" color="primary" @click="copyTextToClipboard(currentGenerated)" />
                <v-btn icon="mdi-key-variant" color="secondary" @click="generate" />
            </div>
        </div>
    </div>
</template>
