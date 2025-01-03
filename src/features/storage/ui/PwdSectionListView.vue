<script setup lang="ts">
import type { PwdSection } from "~entities/passfile/model/entities";
import { t } from "~stores";

const props = defineProps<{
    selected?: PwdSection | undefined;
    sections: PwdSection[];
}>();

const emit = defineEmits<{
    (e: "update:selected", section: PwdSection | undefined): void;
    (e: "back"): void;
}>();
</script>

<template>
    <div>
        <div class="flex flex-col justify-items-stretch gap-2 h-full">
            <div class="flex gap-2 items-center">
                <div class="md:hidden">
                    <v-btn icon="mdi-keyboard-backspace" size="small" @click="emit('back')" />
                </div>
                <v-text-field class="field-only" :label="t('Storage.SectionSearchField.Label')" clearable />
            </div>

            <v-card class="h-full section-list-card">
                <v-list
                    density="compact"
                    :selected="[props.selected]"
                    @update:selected="(sel) => emit('update:selected', sel[0])"
                >
                    <v-list-item v-for="section in props.sections" :key="section.id" :value="section" color="primary">
                        <v-list-item-title>{{ section.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </div>
    </div>
</template>

<style scoped>
.section-list-card {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
}
</style>
