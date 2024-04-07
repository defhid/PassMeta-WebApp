<script setup lang="ts">
import { AppContext } from "~stores";
import { NavBar } from "~widgets/navbar";
</script>

<template>
  <v-layout :key="AppContext.user?.id" class="w-screen h-screen">
    <NavBar />

    <v-main class="h-full w-full">
      <RouterView v-if="AppContext.isLoaded" />

      <v-skeleton-loader class="m-4" type="article" v-if="AppContext.isLoading" />
    </v-main>
  </v-layout>
</template>
