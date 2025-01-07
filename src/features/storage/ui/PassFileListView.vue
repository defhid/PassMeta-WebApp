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
            class="h-full"
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
        </v-list>
    </div>
</template>

<style scoped>
:deep(.v-list) {
    border-radius: 4px;
}
</style>
