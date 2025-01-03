<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {
    PassFileType,
    decryptPassFile,
    type PwdPassFile,
    type PassFile,
    type PwdSection,
    PassFileApi,
} from "~entities/passfile";
import { makePassFile } from "~features/storage/utils/context";
import { PassFileListView, PwdSectionListView, PwdSectionView } from "~features/storage";

const passFiles = ref<PwdPassFile[]>([]);

onMounted(async () => {
    const { list } = await PassFileApi.getList({ typeId: PassFileType.Pwd });
    passFiles.value = list.map(makePassFile<PwdSection[]>);
});

const selected = ref<PwdPassFile>();
const selectedSection = ref<PwdSection>();

function openPassFile(passFile: PassFile<unknown>) {
    alert(JSON.stringify(passFile, undefined, 4));
}

watch(selected, async (passFile, prevPassFile) => {
    if (!passFile) {
        selectedSection.value = undefined;
        return;
    }

    if (passFile.content.decrypted) {
        return;
    }

    passFile.content = {
        encrypted: await PassFileApi.getVersion({
            passfileId: passFile.id,
            version: passFile.version,
        }),
        passphrase: undefined,
    };

    const keyPhrase = window.prompt("Passphrase:");
    if (keyPhrase == null) {
        selected.value = prevPassFile;
        return;
    }

    const result = await decryptPassFile(passFile, keyPhrase);
    if (result.bad) {
        alert(result.message);
        selected.value = prevPassFile;
        return;
    }

    selectedSection.value = undefined;
});
</script>

<template>
    <div class="h-full grid md:grid-cols-[25%_25%_1fr] 2xl:grid-cols-[400px_400px_1fr] gap-2">
        <PassFileListView
            v-model:selected="selected"
            class="h-full md:block"
            :class="{ hidden: selected }"
            :pass-files="passFiles"
            @open="openPassFile"
        />

        <PwdSectionListView
            v-if="selected?.content.decrypted"
            v-model:selected="selectedSection"
            class="h-full md:block"
            :class="{ hidden: selectedSection }"
            :sections="selected?.content.decrypted"
            @back="selected = undefined"
        />

        <PwdSectionView
            v-if="selectedSection"
            class="md:px-3"
            :section="selectedSection"
            @back="selectedSection = undefined"
        />
    </div>
</template>
