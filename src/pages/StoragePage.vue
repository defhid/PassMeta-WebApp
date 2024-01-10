<script setup lang="ts">
import { onMounted, ref } from "vue";
import { PassMetaApi } from "~api";
import { PassFileType } from "~enums/PassFileType";
import type { PassfileDto } from "~generated/api";

const passfiles = ref<PassfileDto[]>([]);

onMounted(async () => {
    const { list } = await PassMetaApi.passfile.getList.execute({ typeId: PassFileType.Pwd });
    passfiles.value = list;
});

</script>

<template>
  <div class="m-4">
    <h4 class="text-h4 text-center mt-2">Storage</h4>

    <div v-for="pf in passfiles" :key="pf.id" class="m-4">
      <span :style="{ color: pf.color ? '#' + pf.color : undefined }">{{ pf.name }}</span>
    </div>
  </div>
</template>
