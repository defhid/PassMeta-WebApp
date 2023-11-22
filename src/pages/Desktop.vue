<script setup lang="ts">
import { useAppConfig } from "@utils/appConfig";

const config = useAppConfig();
</script>

<template>
  <div>
    <h2>Hello from PassMeta!</h2>
    <br>
    <p>Server API is <a>{{ config.PASSMETA_API }}</a></p>
  </div>
</template>

<style scoped>

</style>
