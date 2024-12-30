<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { PassMetaApi } from "~api";
import type { PassfileDto } from "~generated/api";
import { PassFileType, PassFileList } from "~entities/passfile";
import { PassMetaCrypto } from "~/shared/utils/crypto";

const passfiles = ref<PassfileDto[]>([]);

onMounted(async () => {
    const { list } = await PassMetaApi.passfile.getList({ typeId: PassFileType.Pwd });
    passfiles.value = list;
});

const selected = ref<PassfileDto>();
const decryptedContent = ref<string>();

function openPassFile(passfile: PassfileDto) {
    alert(JSON.stringify(passfile));
}

watch(selected, async (passfile) => {
    if (!passfile) {
        decryptedContent.value = undefined;
        return;
    }

    const content = await PassMetaApi.passfile.getVersion({
        passfileId: passfile.id,
        version: passfile.version,
    });

    const keyPhrase = window.prompt("Passphrase:");
    if (keyPhrase == null) {
        decryptedContent.value = undefined;
        return;
    }

    const decrypted = await PassMetaCrypto.decrypt(content, keyPhrase);

    decryptedContent.value = JSON.stringify(JSON.parse(new TextDecoder().decode(decrypted)), undefined, 4);
});
</script>

<template>
    <div class="p-4 h-full">
        <div class="grid grid-cols-[auto_auto_1fr] h-full">
            <v-card class="w-[300px] h-full">
                <PassFileList v-model:selected="selected" :passfiles="passfiles" @open="openPassFile" />
            </v-card>

            <div class="h-full w-full overflow-y-auto px-2">
                <code class="whitespace-pre">{{ decryptedContent }}</code>
            </div>
        </div>
    </div>
</template>
