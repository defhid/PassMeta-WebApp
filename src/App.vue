<script setup lang="ts">
import PassMetaIcon from "@assets/icons/PassMeta.png";
</script>

<template>
  <v-layout>
    <v-app-bar>
      <template #prepend>
        <RouterLink class="grid h-full align-center" to="/">
          <img :src="PassMetaIcon" alt="PM" width="64">
        </RouterLink>
      </template>

      <div class="flex w-full items-start gap-4 px-6">
        <v-btn icon="mdi-safe-square-outline" />
        <v-btn icon="mdi-lightbulb-outline" />
        <v-btn icon="mdi-history" />
      </div>

      <template #append>
        <v-btn icon="mdi-account-circle-outline" to="/auth" />
      </template>
    </v-app-bar>

    <v-main class="w-full h-screen">
      <RouterView />
    </v-main>
  </v-layout>
</template>
