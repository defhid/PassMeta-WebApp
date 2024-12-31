<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { PassMetaApi } from "~api";
import {
    PassFileType,
    PassFileListView,
    PwdSectionListView,
    PwdSectionView,
    decryptPassFile,
    type PwdPassFile,
    type PassFile,
    type PwdSection,
} from "~entities/passfile";
import { makePassFile } from "~entities/passfile/utils/context";

const passfiles = ref<PwdPassFile[]>([]);

onMounted(async () => {
    const { list } = await PassMetaApi.passfile.getList({ typeId: PassFileType.Pwd });
    passfiles.value = list.map(makePassFile<PwdSection[]>);
});

const selected = ref<PwdPassFile>();
const selectedSection = ref<PwdSection>();

function openPassFile(passfile: PassFile<unknown>) {
    alert(JSON.stringify(passfile, undefined, 4));
}

watch(selected, async (passfile, prevPassfile) => {
    if (!passfile) {
        selectedSection.value = undefined;
        return;
    }

    if (passfile.content.decrypted) {
        return;
    }

    passfile.content = {
        encrypted: await PassMetaApi.passfile.getVersion({
            passfileId: passfile.id,
            version: passfile.version,
        }),
        passphrase: undefined,
    };

    const keyPhrase = window.prompt("Passphrase:");
    if (keyPhrase == null) {
        selected.value = prevPassfile;
        return;
    }

    const result = await decryptPassFile(passfile, keyPhrase);
    if (result.bad) {
        alert(result.message);
        selected.value = prevPassfile;
        return;
    }

    selectedSection.value = undefined;
});
</script>

<template>
    <div class="p-4 h-full">
        <div class="grid grid-cols-[auto_auto_1fr] h-full gap-3">
            <v-card class="w-[300px] h-full">
                <PassFileListView v-model:selected="selected" :passfiles="passfiles" @open="openPassFile" />
            </v-card>

            <v-card v-if="selected?.content.decrypted" class="w-[300px] h-full">
                <PwdSectionListView v-model:selected="selectedSection" :sections="selected?.content.decrypted" />
            </v-card>

            <PwdSectionView v-if="selectedSection" :section="selectedSection" />
        </div>
    </div>
</template>
