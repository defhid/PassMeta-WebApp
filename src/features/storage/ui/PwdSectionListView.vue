<script setup lang="ts">
import type { PwdSection } from "~entities/passfile/model/entities";
import { t } from "~stores";
import { computed, ref } from "vue";
import { refDebounced } from "@vueuse/shared";

const props = defineProps<{
    selected?: PwdSection | undefined;
    sections: PwdSection[];
    disabled: boolean;
}>();

const emit = defineEmits<{
    (e: "update:selected", section: PwdSection | undefined): void;
    (e: "back"): void;
    (e: "add-section"): void;
}>();

const searchText = ref("");
const searchTextDebounced = refDebounced(searchText, 700);

const filteredSections = computed(() => {
    const textRaw = searchTextDebounced.value;
    const text = textRaw?.trim().toLowerCase();
    const textAsRemark = text?.startsWith("#") ? text.slice(1, text.length) : null;

    const list = text
        ? props.sections.filter(
              (x) =>
                  x.name.toLowerCase().includes(text) ||
                  x.websiteUrl.toLowerCase().includes(text) ||
                  (textAsRemark && x.items.some((x) => x.remark.toLowerCase().startsWith(textAsRemark))) ||
                  x.items.some((x) => x.password === textRaw),
          )
        : [...props.sections];

    return list.sort((a, b) => (a.name < b.name ? -1 : 1));
});
</script>

<template>
    <div class="min-h-0">
        <div class="grid grid-rows-[auto_1fr] justify-items-stretch gap-2 h-full">
            <div class="flex gap-2 items-center">
                <div class="md:hidden">
                    <PmButton
                        icon="pi pi-arrow-left"
                        severity="secondary"
                        size="large"
                        rounded
                        variant="outlined"
                        @click="emit('back')"
                    />
                </div>
                <PmInputText
                    v-model="searchText"
                    class="search-input"
                    :placeholder="t('Storage.SectionSearchField.Label')"
                    size="large"
                    type="search"
                    :disabled
                />
            </div>

            <div class="min-h-0 h-full relative">
                <PmListbox
                    class="section-listbox"
                    :model-value="selected"
                    :options="filteredSections"
                    :disabled
                    scroll-height="100%"
                    option-label="name"
                    @update:model-value="(sel) => emit('update:selected', sel)"
                />

                <div v-show="!disabled" class="absolute left-0 right-0 bottom-0 backdrop-blur-[2px]">
                    <PmButton
                        class="btn-add"
                        icon="pi pi-plus"
                        severity="secondary"
                        @click.stop="emit('add-section')"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.section-listbox {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    background-color: var(--p-card-background);
    border: none;
    overflow: hidden;
    padding: 0.5rem 0;

    --p-listbox-list-padding: 0 0 calc(40px + 0.25rem) 0;
}

:deep(.p-listbox-option) {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.btn-add {
    height: 40px;
    width: 100%;
    opacity: 0.5;
}

.search-input {
    width: 100%;
    --p-inputtext-lg-font-size: 1rem;
}
</style>
