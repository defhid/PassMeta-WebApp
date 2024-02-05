<script setup lang="ts">
import { onMounted, ref } from "vue";
import { PassMetaApi } from "~api";
import type { PassfileDto } from "~generated/api";
import { PassFileListCard, PassFileType } from "~entities/passfile";

const passfiles = ref<PassfileDto[]>([]);

onMounted(async () => {
    const { list } = await PassMetaApi.passfile.getList.execute({ typeId: PassFileType.Pwd });
    passfiles.value = list;
});

</script>

<template>
  <div class="m-4">
    <h4 class="text-h4 text-center mt-2">Storage</h4>

    <PassFileListCard v-for="pf in passfiles" :key="pf.id" :passfile="pf" />
  </div>
</template>
