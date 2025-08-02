<script setup lang="ts">
import type { AskTextOptions } from "~entities/dialog/types";
import { nextTick, onMounted, ref, useId } from "vue";
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

const inputId = useId();

onMounted(() =>
    nextTick(() => {
        const input = document.getElementById(inputId) as HTMLInputElement | null;
        input?.focus(); // IOS autofocus fix
    }),
);
</script>

<template>
    <PmCard v-focustrap class="self-center w-full max-w-[500px]">
        <template #title>
            {{ props.title ?? t("Dialog.DefaultAskTitle") }}
        </template>

        <template #content>
            <div class="flex flex-col gap-3 pb-2">
                <label class="text-surface-300" :for="inputId">{{ props.question }}</label>
                <PmInputPassword
                    v-if="isPassword"
                    v-model="textValue"
                    :input-id="inputId"
                    fluid
                    autofocus
                    toggle-mask
                    :feedback="false"
                    @keydown.enter="emit('answer', textValue ?? '')"
                />
                <PmInputText
                    v-else
                    :id="inputId"
                    v-model="textValue"
                    fluid
                    autofocus
                    @keydown.enter="emit('answer', textValue ?? '')"
                />
            </div>
        </template>

        <template #footer>
            <div ref="footer" class="flex gap-2 justify-end">
                <PmButton class="px-6" :label="t('Dialog.BtnOk')" @click.stop="emit('answer', textValue ?? '')" />
                <PmButton
                    class="px-4"
                    severity="secondary"
                    :label="t('Dialog.BtnCancel')"
                    @click.stop="emit('answer', null)"
                />
            </div>
        </template>
    </PmCard>
</template>
