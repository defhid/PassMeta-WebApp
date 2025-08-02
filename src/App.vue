<script setup lang="ts">
import { useAppContext } from "~stores";
import { NavBar } from "~pages";
import { DialogsContainer } from "~entities/dialog";
import Toast, { type ToastBreakpointsType } from "primevue/toast";
import { initNotify } from "~utils";

const { currentUser, isContextLoaded, isContextLoading } = useAppContext();

initNotify();

const toastBreakpoints: ToastBreakpointsType = {
    "200px": { width: "75vw" },
    "500px": { width: "calc(100vw - 40px)" },
};
</script>

<template>
    <main :key="currentUser?.id" class="app-layout">
        <NavBar />

        <div class="app-content">
            <RouterView v-if="isContextLoaded" :key="currentUser?.id" v-slot="{ Component }">
                <KeepAlive>
                    <Component :is="Component" />
                </KeepAlive>
            </RouterView>

            <div v-if="isContextLoading" class="absolute top-0 w-full h-full flex justify-center items-center pb-10">
                <PmProgressSpinner indeterminate />
            </div>
        </div>

        <Toast position="bottom-right" :breakpoints="toastBreakpoints" close-icon="pi pi-times" />
        <DialogsContainer />
    </main>
</template>

<style scoped>
.app-layout {
    width: 100vw;
    height: 100dvh;
    min-width: 360px;
    max-width: 1920px;
    display: grid;
    grid-template-rows: auto 1fr;
    padding: 0.5rem 0.5rem clamp(0.5rem, env(safe-area-inset-bottom, 0.5rem), 2rem) 0.5rem;
    gap: 0.5rem;
}

.app-content {
    height: 100%;
    overflow-y: auto;
}
</style>
