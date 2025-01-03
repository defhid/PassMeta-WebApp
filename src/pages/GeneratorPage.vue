<script setup lang="ts">
import { t } from "~stores";
import GeneratorView from "~features/generator/ui/GeneratorView.vue";
</script>

<template>
    <div class="flex flex-col justify-items-center gap-7 my-6">
        <h4 class="text-h4 text-center">{{ t("Generator.Title") }}</h4>

        <GeneratorView class="self-center" />
    </div>
</template>
