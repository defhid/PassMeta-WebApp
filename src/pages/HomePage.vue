<script setup lang="ts">
import { AppContext } from "~stores";
import { Routes } from "~routing";
</script>

<template>
  <div class="p-4">
    <h4 class="text-h4 text-center mt-2 mb-7">
      {{ $t(AppContext.user ? "Home.TitleKnown" : "Home.TitleUnknown") }}
      <span v-if="AppContext.user">
        ,
        <RouterLink class="text-green" :to="Routes.Account.to()">
          {{ AppContext.user!.fullName ?? AppContext.user!.login }}
        </RouterLink>
      </span>
    </h4>

    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
      <b>{{ $t("Home.LabelServerId") }}:</b>
      <i class="text-medium-emphasis">{{ AppContext.serverId }}</i>

      <b>{{ $t("Home.LabelServerVersion") }}:</b>
      <i class="text-medium-emphasis">{{ AppContext.serverVersion }}</i>
    </div>

    <div v-if="!AppContext.user" class="mt-7">
      <v-btn size="small" :to="Routes.Auth.to()">{{ $t("Home.BtnAuthorize") }}</v-btn>
    </div>
  </div>
</template>
