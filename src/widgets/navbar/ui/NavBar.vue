<script setup lang="ts">
import PassMetaIcon from "~assets/icons/PassMeta.png";
import { Routes } from "~routing";
import { AppContext } from "~stores";
import { closeCurrentSession } from "~features/auth";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <v-app-bar>
    <template #prepend>
      <RouterLink class="grid h-full align-center" :to="Routes.Home.to()">
        <img :src="PassMetaIcon" alt="PM" width="64">
      </RouterLink>
    </template>

    <div class="flex w-full items-start gap-4 px-6">
      <v-btn icon="mdi-safe-square-outline" :to="Routes.Storage.to()" />
      <v-btn icon="mdi-lightbulb-outline" :to="Routes.Generator.to()" />
      <v-btn icon="mdi-history" :to="Routes.History.to()" />
    </div>

    <template #append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-account-circle-outline" />
        </template>

        <v-list class="min-w-[150px]">
          <v-list-item
            v-if="AppContext.user != undefined"
            :value="1"
            :to="Routes.Account.to()"
          >
            <v-list-item-title>{{ $t("App.NavigationBar.Account") }}</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-else
            :value="1"
            :to="Routes.Auth.to()"
          >
            <v-list-item-title>{{ $t("App.NavigationBar.SignIn") }}</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="AppContext.user != undefined"
            :value="2"
            @click.stop="closeCurrentSession(router)"
          >
            <v-list-item-title>{{ $t("App.NavigationBar.SignOut") }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>
