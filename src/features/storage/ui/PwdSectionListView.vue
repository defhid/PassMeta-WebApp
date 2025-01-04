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

    if (!text) {
        return props.sections;
    }

    return props.sections.filter(
        (x) => x.name.toLowerCase().includes(text) || x.websiteUrl.toLowerCase().includes(text),
    );
});
</script>

<template>
    <div>
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

            <v-card class="h-full section-list-card">
                <v-list
                    density="compact"
                    :selected="[selected]"
                    @update:selected="(sel) => emit('update:selected', sel[0])"
                >
                    <v-list-item v-for="section in filteredSections" :key="section.id" :value="section" color="primary">
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
