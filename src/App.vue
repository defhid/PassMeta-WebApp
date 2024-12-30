<script setup lang="ts">
import { useAppContext } from "~stores";
import { NavBar } from "~widgets/navbar";

const { currentUser, isContextLoaded, isContextLoading } = useAppContext();
</script>

<template>
    <v-layout :key="currentUser?.id" class="w-screen h-screen">
        <NavBar />

        <v-main class="h-full w-full">
            <RouterView v-if="isContextLoaded" />

            <v-skeleton-loader v-if="isContextLoading" class="m-4" type="article" />
        </v-main>
    </v-layout>
</template>
