<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { decryptPassFile, type PwdPassFile, type PassFile, type PwdSection, PassFileApi } from "~entities/passfile";
import {
    PassFileListView,
    PwdSectionListView,
    PwdSectionView,
    usePassPhraseAskHelper,
    usePwdPassFileContext,
} from "~features/storage";
import { t } from "~stores";
import { synchronizePassFiles } from "~features/storage/utils/synchronizer.ts";

const context = usePwdPassFileContext();

onMounted(() => synchronizePassFiles(context));

const selected = ref<PwdPassFile>();
const selectedSection = ref<PwdSection>();

function openPassFile(passFile: PassFile<unknown>) {
    alert(JSON.stringify(passFile, undefined, 4));
}

const { askLooped } = usePassPhraseAskHelper();

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
        passPhrase: undefined,
    };

    const keyPhrase = await askLooped({
        question: t("Passfile.AskPassphrase"),
        repeatQuestion: t("Passfile.AskPassphraseAgain"),
        validator: async (val) => (await decryptPassFile(passFile, val)).ok,
    });

    if (keyPhrase == null) {
        selected.value = prevPassFile;
        return;
    }

    selectedSection.value = undefined;
});

function addSection() {
    selected.value?.content.decrypted?.push({
        id: crypto.randomUUID(),
        name: t("Passfile.AskPassphrase"),
        websiteUrl: "",
        items: [],
    });
}
</script>

<template>
    <div class="h-full grid md:grid-cols-[25%_25%_1fr] 2xl:grid-cols-[400px_400px_1fr] gap-2">
        <PassFileListView
            v-model:selected="selected"
            class="h-full md:block"
            :class="{ hidden: selected }"
            :pass-files="context.currentList.value"
            @open="openPassFile"
        />

        <PwdSectionListView
            v-if="selected?.content.decrypted"
            v-model:selected="selectedSection"
            class="h-full md:block"
            :class="{ hidden: selectedSection }"
            :sections="selected.content.decrypted"
            @back="selected = undefined"
            @add-section="addSection"
        />

        <PwdSectionView
            v-if="selectedSection"
            class="h-full"
            :section="selectedSection"
            @back="selectedSection = undefined"
        />
    </div>
</template>
