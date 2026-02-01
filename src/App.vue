<script setup lang="ts">
import { useAppContext } from "~stores";
import { NavBar } from "~pages";
import { DialogsContainer } from "~entities/dialog";
import Toast from "primevue/toast";
import { initNotify, useMobileFirstBreakpoints } from "~utils";

const { currentUser, isContextLoaded, isContextLoading } = useAppContext();

initNotify();

const { md } = useMobileFirstBreakpoints();
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
                <PmProgressSpinner class="app-progress-spinner" indeterminate />
            </div>
        </div>

        <Toast class="app-toast" :position="md ? 'top-right' : 'bottom-center'" close-icon="pi pi-times" />
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

.app-progress-spinner {
    width: 75px;
}
</style>

<style>
.app-toast {
    --p-toast-summary-font-size: 0.95rem;
    --p-toast-detail-font-size: 0.8rem;
    --p-toast-text-gap: 0.1rem;
    --p-toast-icon-size: 1.1rem;
    --p-toast-close-icon-size: 0.85rem;
    --p-toast-content-padding: 0.5rem;
    --p-toast-content-gap: 0.45rem;
    transform: translateY(56px) translateX(12px);
}

.p-toast-message-text {
    margin-top: -3px;
}

@media all and (width <= 500px) {
    .app-toast {
        --p-toast-width: calc(100vw - 1.5rem);
    }
}

@media all and (width <= 768px) {
    .app-toast {
        margin-bottom: calc(0.65rem + clamp(0.5rem, env(safe-area-inset-bottom, 0.5rem), 2rem));
    }
}
</style>
