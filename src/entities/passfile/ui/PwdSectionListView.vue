<script setup lang="ts">
import type { PwdSection } from "~entities/passfile/model/entities";

const props = defineProps<{
    selected?: PwdSection | undefined;
    sections: PwdSection[];
}>();

const emit = defineEmits<{
    (e: "update:selected", section: PwdSection | undefined): void;
}>();
</script>

<template>
    <v-list density="compact" :selected="[props.selected]" @update:selected="(sel) => emit('update:selected', sel[0])">
        <v-list-item v-for="section in props.sections" :key="section.id" :value="section" color="primary">
            <v-list-item-title>{{ section.name }}</v-list-item-title>
        </v-list-item>
    </v-list>
</template>
