<script setup lang="ts">
import { useAppContext } from "~stores";
import { NavBar } from "~widgets/navbar";

const { currentUser, isContextLoaded, isContextLoading } = useAppContext();
</script>

<template>
    <v-layout :key="currentUser?.id" class="app-layout">
        <NavBar />

        <div class="app-content">
            <RouterView v-if="isContextLoaded" :key="currentUser?.id" v-slot="{ Component }">
                <KeepAlive>
                    <Component :is="Component" />
                </KeepAlive>
            </RouterView>

            <div v-if="isContextLoading" class="w-full h-full flex justify-center items-center pb-10">
                <v-progress-circular model-value="20" indeterminate />
            </div>
        </div>
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
