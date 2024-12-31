<script setup lang="ts">
import type { PwdSection } from "~entities/passfile";

const props = defineProps<{
    section: PwdSection;
}>();
</script>

<template>
    <div>
        <div>{{ section.name }}</div>

        <hr class="mt-5" />

        <div v-for="(item, i) in section.items" :key="i" class="flex flex-col mt-2">
            <span class="opacity-40">{{ item.remark }}</span>
            <span>login: {{ item.usernames.join() }}</span>
            <span>password: {{ item.password }}</span>
        </div>
    </div>
</template>
