<script setup lang="ts">
import type { AskTextOptions } from "~entities/dialog/types";
import { nextTick, onMounted, ref, useId } from "vue";
import { t } from "~stores";
import { useMobileFirstBreakpoints } from "~utils";

const props = defineProps<
    AskTextOptions & {
        isPassword: boolean;
    }
>();

const emit = defineEmits<{
    (e: "answer", result: string | null): void;
}>();

const { md } = useMobileFirstBreakpoints();
const isFocused = ref(true);

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
    <PmDialog
        visible
        modal
        keep-in-viewport
        :closable="false"
        :position="md || !isFocused ? 'center' : 'top'"
        :header="props.title ?? t('Dialog.DefaultAskTitle')"
    >
        <div v-focustrap class="w-[80vw] max-w-[500px] flex flex-col gap-2">
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
                    @keydown.esc="emit('answer', null)"
                    @focus="isFocused = true"
                    @blur="isFocused = false"
                />
                <PmInputText
                    v-else
                    :id="inputId"
                    v-model="textValue"
                    fluid
                    autofocus
                    @keydown.enter="emit('answer', textValue ?? '')"
                    @keydown.esc="emit('answer', null)"
                    @focus="isFocused = true"
                    @blur="isFocused = false"
                />
            </div>

            <div ref="footer" class="flex gap-2 justify-end">
                <PmButton class="px-6" :label="t('Dialog.BtnOk')" @click.stop="emit('answer', textValue ?? '')" />
                <PmButton
                    class="px-4"
                    severity="secondary"
                    :label="t('Dialog.BtnCancel')"
                    @click.stop="emit('answer', null)"
                />
            </div>
        </div>
    </PmDialog>
</template>
