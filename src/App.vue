<script setup lang="ts">
import PassMetaIcon from "@assets/icons/PassMeta.png";
import { PassMetaApi } from "@api";
import { AppContext } from "@stores/appContext";
import { useRouter } from "vue-router";
import { Routes } from "@routing/routes";

const router = useRouter();

async function singOut() {
    await PassMetaApi.auth.resetMe.execute();
    AppContext.setUser(null);
    await router.push({ name: "Auth" });
}
</script>

<template>
  <v-layout :key="AppContext.user?.id">
    <v-app-bar>
      <template #prepend>
        <RouterLink class="grid h-full align-center" :to="Routes.Home.to()">
          <img :src="PassMetaIcon" alt="PM" width="64">
        </RouterLink>
      </template>

      <div class="flex w-full items-start gap-4 px-6">
        <v-btn icon="mdi-safe-square-outline" :to="Routes.Storage.to()" />
        <v-btn icon="mdi-lightbulb-outline" />
        <v-btn icon="mdi-history" />
      </div>

      <template #append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-account-circle-outline" />
          </template>

          <v-list class="min-w-[150px]">
            <v-list-item :value="1" v-if="AppContext.user != undefined" :to="Routes.Account.to()">
              <v-list-item-title>{{ $t("App.NavigationBar.Account") }}</v-list-item-title>
            </v-list-item>

            <v-list-item :value="1" v-else :to="Routes.Auth.to()">
              <v-list-item-title>{{ $t("App.NavigationBar.SignIn") }}</v-list-item-title>
            </v-list-item>

            <v-list-item :value="2" v-if="AppContext.user != undefined" @click.stop="singOut">
              <v-list-item-title>{{ $t("App.NavigationBar.SignOut") }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main class="w-full h-screen">
      <RouterView v-if="AppContext.isLoaded" />

      <v-skeleton-loader class="m-4" type="article" v-if="AppContext.isLoading" />
    </v-main>
  </v-layout>
</template>
