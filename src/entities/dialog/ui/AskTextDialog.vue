<script setup lang="ts">
import type { AskTextOptions } from "~entities/dialog/types";
import { ref } from "vue";
import { t } from "~stores";

const props = defineProps<
    AskTextOptions & {
        isPassword: boolean;
    }
>();

const emit = defineEmits<{
    (e: "answer", result: string | null): void;
}>();

const textValue = ref("");
</script>

<template>
    <v-card class="self-center w-full max-w-[600px]" :title="props.title ?? t('Dialog.DefaultAskTitle')">
        <div class="mx-4">{{ props.question }}</div>
        <v-text-field
            v-model="textValue"
            class="mx-4 mt-4 mb-3 field-only"
            autofocus
            variant="outlined"
            density="compact"
            :type="props.isPassword ? 'password' : 'text'"
            @keydown.enter="emit('answer', textValue ?? '')"
        />
        <template #actions>
            <div class="flex gap-2">
                <v-btn class="ml-auto" :text="t('Dialog.BtnOk')" @click="emit('answer', textValue ?? '')" />
                <v-btn class="ml-auto" :text="t('Dialog.BtnCancel')" @click="emit('answer', null)" />
            </div>
        </template>
    </v-card>
</template>
