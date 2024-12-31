<script setup lang="ts">
import type { PassFile } from "~entities/passfile";

const props = defineProps<{
    selected?: PassFile<unknown> | undefined;
    passfiles: PassFile<unknown>[];
}>();

const emit = defineEmits<{
    (e: "open", passfile: PassFile<unknown>): void;
    (e: "update:selected", passfile: PassFile<unknown> | undefined): void;
}>();
</script>

<template>
    <v-list density="compact" :selected="[props.selected]" @update:selected="(sel) => emit('update:selected', sel[0])">
        <v-list-item v-for="pf in props.passfiles" :key="pf.id" :value="pf" color="primary">
            <div class="flex items-center gap-2">
                <v-btn
                    icon="mdi-folder"
                    size="x-small"
                    :style="{ color: pf.color ? '#' + pf.color : undefined }"
                    @click.stop="emit('open', pf)"
                />
                <v-list-item-title>{{ pf.name }}</v-list-item-title>
            </div>
        </v-list-item>
    </v-list>
</template>
