<script setup lang="ts">
import { useAppSettings } from "~stores";
import { computed } from "vue";
import { DefaultAboutView, RuAboutView } from "~widgets/about";

const settings = useAppSettings();

const component = computed(() => {
    switch (settings.locale) {
        case "ru":
            return RuAboutView;
        default:
            return DefaultAboutView;
    }
});
</script>

<template>
    <Component :is="component" />
</template>
