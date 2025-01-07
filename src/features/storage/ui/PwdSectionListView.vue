<script setup lang="ts">
import type { PwdSection } from "~entities/passfile/model/entities";
import { t } from "~stores";
import { computed, ref } from "vue";
import { refDebounced } from "@vueuse/shared";

const props = defineProps<{
    selected?: PwdSection | undefined;
    sections: PwdSection[];
}>();

const emit = defineEmits<{
    (e: "update:selected", section: PwdSection | undefined): void;
    (e: "back"): void;
}>();

const searchText = ref("");
const searchTextDebounced = refDebounced(searchText, 700);

const filteredSections = computed(() => {
    const text = searchTextDebounced.value?.trim().toLowerCase();

    const list = text
        ? props.sections.filter((x) => x.name.toLowerCase().includes(text) || x.websiteUrl.toLowerCase().includes(text))
        : [...props.sections];

    return list.sort((a, b) => (a.name < b.name ? -1 : 1));
});
</script>

<template>
    <div class="min-h-0">
        <div class="flex flex-col justify-items-stretch gap-2 h-full">
            <div class="flex gap-2 items-center">
                <div class="md:hidden">
                    <v-btn icon="mdi-keyboard-backspace" size="small" @click="emit('back')" />
                </div>
                <v-text-field
                    v-model="searchText"
                    class="field-only"
                    :label="t('Storage.SectionSearchField.Label')"
                    clearable
                />
            </div>

            <v-list
                class="h-full"
                density="compact"
                :selected="[selected]"
                @update:selected="(sel) => emit('update:selected', sel[0])"
            >
                <v-list-item v-for="section in filteredSections" :key="section.id" :value="section" color="primary">
                    <v-list-item-title>{{ section.name }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </div>
    </div>
</template>

<style scoped>
:deep(.v-list) {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
</style>
