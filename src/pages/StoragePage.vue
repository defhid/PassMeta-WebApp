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
import { t } from "~stores";

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
    <div class="h-full">
        <div class="grid md:grid-cols-[25%_25%_1fr] 2xl:grid-cols-[400px_400px_1fr] h-full gap-2">
            <div class="md:block" :class="{ hidden: selected }">
                <v-card class="h-full">
                    <PassFileListView v-model:selected="selected" :passfiles="passfiles" @open="openPassFile" />
                </v-card>
            </div>

            <div
                v-if="selected?.content.decrypted"
                class="md:flex flex-col justify-items-stretch"
                :class="{ hidden: selectedSection }"
            >
                <v-text-field :label="t('Storage.SectionSearchField.Label')" clearable />

                <v-card class="h-full section-list-card">
                    <PwdSectionListView v-model:selected="selectedSection" :sections="selected?.content.decrypted" />
                </v-card>
            </div>

            <PwdSectionView v-if="selectedSection" class="px-3" :section="selectedSection" />
        </div>
    </div>
</template>

<style scoped>
.section-list-card {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
}
</style>
