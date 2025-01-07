<script setup lang="ts">
import { useAppSettings } from "~stores";
import { computed } from "vue";
import { DefaultAboutView, RuAboutView } from "~widgets/about";

const { locale } = useAppSettings();

const component = computed(() => {
    switch (locale) {
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
