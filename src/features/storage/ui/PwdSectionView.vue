<script setup lang="ts">
import type { PwdSection } from "~entities/passfile";
import { normalizeExternalUrl } from "~utils";
import PwdItemView from "~features/storage/ui/PwdItemView.vue";

defineProps<{
    section: PwdSection;
}>();

const emit = defineEmits<{
    (e: "back"): void;
}>();
</script>

<template>
    <div class="md:pt-2 min-h-0">
        <div class="flex flex-col justify-items-stretch h-full">
            <div class="flex flex-wrap items-center pt-2 pb-1 md:px-3 gap-x-2 gap-y-5">
                <div class="grid grid-cols-[auto_auto] items-center gap-3">
                    <div class="md:hidden">
                        <v-btn icon="mdi-keyboard-backspace" size="small" @click="emit('back')" />
                    </div>
                    <h5 class="text-h5 truncate">{{ section.name }}</h5>
                </div>

                <a v-if="section.websiteUrl" :href="normalizeExternalUrl(section.websiteUrl)" target="_blank">
                    <v-btn variant="plain" density="compact" class="italic" :text="section.websiteUrl" />
                </a>
            </div>

            <div class="h-full overflow-y-auto mt-3.5 md:mt-3 md:px-3">
                <div class="grid gap-2 pb-10">
                    <PwdItemView v-for="(item, i) in section.items" :key="i" :item="item" />
                </div>
            </div>
        </div>
    </div>
</template>
