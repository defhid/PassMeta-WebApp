<script setup lang="ts">
import { useAppConfig } from "@utils/appConfig";

const config = useAppConfig();
</script>

<template>
  <div>
    <h1 class="text-center mt-20 text-3xl">Welcome!</h1>
    <br>
    <br>
    <p class="pl-4">
      <strong>Server API</strong>:
      <a
        class="italic"
        :href="config.PASSMETA_API + '/info'"
        target="_blank"
      >
        {{ config.PASSMETA_API }}/info
      </a>
    </p>
  </div>
</template>
