<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { PassMetaApi } from "~api";
import type { PassfileDto } from "~generated/api";
import { PassFileType, PassFileList } from "~entities/passfile";

const passfiles = ref<PassfileDto[]>([]);

onMounted(async () => {
    const { list } = await PassMetaApi.passfile.getList({ typeId: PassFileType.Pwd });
    passfiles.value = list;
});

const selected = ref<PassfileDto>();

function openPassFile(passfile: PassfileDto) {
    alert(JSON.stringify(passfile));
}

watch(selected, async (passfile) => {
    if (!passfile) {
        return;
    }

    const content = await PassMetaApi.passfile.getVersion({
        passfileId: passfile.id,
        version: passfile.version,
    });

    console.log(content);
});
</script>

<template>
    <div class="p-4 h-full">
        <div class="grid grid-cols-[auto_auto_1fr] h-full">
            <v-card class="w-[300px] h-full">
                <PassFileList v-model:selected="selected" :passfiles="passfiles" @open="openPassFile" />
            </v-card>
        </div>
    </div>
</template>
