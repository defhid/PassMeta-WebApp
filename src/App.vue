<script setup lang="ts">
import { AppContext } from "~stores";
import { NavBar } from "~widgets/navbar";
</script>

<template>
  <v-layout :key="AppContext.user?.id">
    <NavBar />

    <v-main class="w-full h-screen">
      <RouterView v-if="AppContext.isLoaded" />

      <v-skeleton-loader class="m-4" type="article" v-if="AppContext.isLoading" />
    </v-main>
  </v-layout>
</template>
