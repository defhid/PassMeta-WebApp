<script setup lang="ts">
import type { PassfileDto } from "~generated/api";

defineProps<{
    passfile: PassfileDto,
}>();
</script>

<template>
  <div class="m-4">
    <span :style="{ color: passfile.color ? '#' + passfile.color : undefined }">
      {{ passfile.name }}
    </span>
  </div>
</template>
