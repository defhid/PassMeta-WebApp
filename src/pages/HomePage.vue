<script setup lang="ts">
import { AppConfig } from "@stores/appConfig";

</script>

<template>
  <div>
    <h1 class="text-center mt-10 text-3xl">Welcome!</h1>
    <br>
    <br>
    <p class="pl-4">
      <strong>Server API</strong>:
      <a
        class="italic"
        :href="AppConfig.PASSMETA_API + '/info'"
        target="_blank"
      >
        {{ AppConfig.PASSMETA_API }}/info
      </a>
    </p>
  </div>
</template>
