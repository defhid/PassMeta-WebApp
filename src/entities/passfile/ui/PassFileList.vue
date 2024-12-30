<script setup lang="ts">
import type { PassfileDto } from "~generated/api";

const props = defineProps<{
    selected?: PassfileDto | undefined;
    passfiles: PassfileDto[];
}>();

const emit = defineEmits<{
    (e: "open", passfile: PassfileDto): void;
    (e: "update:selected", passfile: PassfileDto | undefined): void;
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
