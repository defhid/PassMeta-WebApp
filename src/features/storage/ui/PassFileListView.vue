<script setup lang="ts" generic="TContent">
import type { PassFile } from "~entities/passfile";

defineProps<{
    selected?: PassFile<TContent> | undefined;
    passFiles: PassFile<TContent>[];
}>();

const emit = defineEmits<{
    (e: "open", passFile: PassFile<TContent>): void;
    (e: "update:selected", passFile: PassFile<TContent> | undefined): void;
}>();
</script>

<template>
    <div class="min-h-0">
        <v-list
            class="passfile-list"
            density="compact"
            :selected="[selected]"
            @update:selected="(sel) => emit('update:selected', sel[0])"
        >
            <v-list-item v-for="passFile in passFiles" :key="passFile.id" :value="passFile" color="primary">
                <div class="flex items-center gap-2">
                    <v-btn
                        icon="mdi-folder"
                        size="x-small"
                        :style="{ color: passFile.color ? '#' + passFile.color : undefined }"
                        @click.stop="emit('open', passFile)"
                    />
                    <v-list-item-title>{{ passFile.name }}</v-list-item-title>
                </div>
            </v-list-item>

            <div class="absolute left-0 right-0 bottom-0">
                <v-btn class="btn-add" text="+" variant="tonal" />
            </div>
        </v-list>
    </div>
</template>

<style scoped>
.passfile-list {
    @apply h-full pb-8 relative;
    border-radius: 4px;
}

.btn-add {
    --v-btn-height: 28px;
    width: 100%;
    font-size: 1.35rem;
    color: rgba(var(--v-theme-on-surface), 0.4);
}
</style>
