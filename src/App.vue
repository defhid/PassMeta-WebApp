<script setup lang="ts">
import { useAppContext } from "~stores";
import { NavBar } from "~widgets/navbar";

const { currentUser, isContextLoaded, isContextLoading } = useAppContext();
</script>

<template>
    <v-layout :key="currentUser?.id" class="app-layout">
        <NavBar />

        <RouterView v-if="isContextLoaded" />

        <v-skeleton-loader v-if="isContextLoading" class="m-4" type="article" />
    </v-layout>
</template>

<style scoped>
.app-layout {
    width: 100vw;
    height: 100vh;
    min-width: 360px;
    max-width: 1920px;
    display: grid;
    grid-template-rows: auto 1fr;
    padding: 0.5rem;
    gap: 0.5rem;
}
</style>
