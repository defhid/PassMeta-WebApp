<script setup lang="ts">
import { useAppContext } from "~stores";
import { NavBar } from "~widgets/navbar";

const { currentUser, isContextLoaded, isContextLoading } = useAppContext();
</script>

<template>
    <v-layout :key="currentUser?.id" class="app-layout">
        <NavBar />

        <div class="app-content">
            <RouterView v-if="isContextLoaded" />
        </div>

        <v-skeleton-loader v-if="isContextLoading" class="m-4" type="article" />
    </v-layout>
</template>

<style scoped>
.app-layout {
    width: 100vw;
    height: 100dvh;
    min-width: 360px;
    max-width: 1920px;
    display: grid;
    grid-template-rows: auto 1fr;
    padding: 0.5rem;
    gap: 0.5rem;
}

.app-content {
    height: 100%;
    overflow-y: auto;
}
</style>
