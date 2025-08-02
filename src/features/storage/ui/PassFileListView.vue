<script setup lang="ts" generic="TContent">
import type { PassFile } from "~entities/passfile";

defineProps<{
    selected?: PassFile<TContent> | undefined;
    passFiles: PassFile<TContent>[];
}>();

const emit = defineEmits<{
    (e: "open", passFile: PassFile<TContent>): void;
    (e: "update:selected", passFile: PassFile<TContent> | undefined): void;
    (e: "add-passfile"): void;
}>();
</script>

<template>
    <div class="min-h-0 relative">
        <PmListbox
            class="passfile-listbox"
            :model-value="selected"
            :options="passFiles"
            @update:model-value="(sel) => emit('update:selected', sel)"
        >
            <template #option="{ option }">
                <div class="flex items-center gap-3">
                    <PmButton
                        icon="pi pi-file"
                        size="small"
                        :style="{ color: option.color ? '#' + option.color : undefined }"
                        rounded
                        raised
                        severity="secondary"
                        @click.stop="emit('open', option)"
                    />
                    <span class="font-black text-surface-300">{{ option.name }}</span>
                </div>
            </template>
        </PmListbox>

        <div class="absolute left-0 right-0 bottom-0 backdrop-blur-[2px]">
            <PmButton class="btn-add" icon="pi pi-plus" severity="secondary" @click.stop="emit('add-passfile')" />
        </div>
    </div>
</template>

<style scoped>
.passfile-listbox {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    border-radius: var(--p-card-border-radius);
    background-color: var(--p-card-background);
    border: none;
    overflow: hidden;
    padding: 0.5rem 0;

    --p-listbox-list-padding: 0 0 calc(40px + 0.25rem) 0;
}

.btn-add {
    height: 40px;
    width: 100%;
    opacity: 0.5;
    border-radius: var(--p-card-border-radius);
}
</style>
