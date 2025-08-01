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
    (e: "add-section"): void;
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
                class="section-list"
                density="compact"
                :selected="[selected]"
                @update:selected="(sel) => emit('update:selected', sel[0])"
            >
                <div class="h-full min-h-0 pb-10 overflow-y-auto">
                    <v-list-item v-for="section in filteredSections" :key="section.id" :value="section" color="primary">
                        <v-list-item-title>{{ section.name }}</v-list-item-title>
                    </v-list-item>
                </div>

                <div class="absolute left-0 right-0 bottom-0">
                    <v-btn class="btn-add" text="+" variant="tonal" @click.stop="emit('add-section')" />
                </div>
            </v-list>
        </div>
    </div>
</template>

<style scoped>
.section-list {
    @apply h-full relative;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.btn-add {
    --v-btn-height: 40px;
    padding-bottom: 2px;
    width: 100%;
    font-size: 1.35rem;
    color: rgba(var(--v-theme-on-surface), 0.4);
    backdrop-filter: blur(2px);
}
</style>
