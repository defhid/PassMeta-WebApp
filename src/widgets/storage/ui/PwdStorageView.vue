<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { decryptPassFile, type PwdPassFile, type PassFile, type PwdSection } from "~entities/passfile";
import {
    PassFileListView,
    PwdSectionListView,
    PwdSectionView,
    usePassPhraseAskHelper,
    usePwdPassFileContext,
} from "~features/storage";
import { t } from "~stores";
import { synchronizePassFiles } from "~features/storage/utils/synchronizer.ts";
import { useDialogs } from "~entities/dialog";

const context = usePwdPassFileContext();

onMounted(() => synchronizePassFiles(context));

const selected = ref<PwdPassFile>();
const selectedSection = ref<PwdSection>();

function openPassFile(passFile: PassFile<unknown>) {
    alert(JSON.stringify(passFile, undefined, 4));
}

const { askLooped } = usePassPhraseAskHelper();

watch(
    selected,
    async (passFile, prevPassFile) => {
        if (!passFile) {
            selectedSection.value = undefined;
            return;
        }

        if (passFile.content.decrypted) {
            return;
        }

        if (!(await context.provideEncryptedContent(passFile))) {
            return;
        }

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
    },
    { flush: "sync" },
);

const { askPassword } = useDialogs();

async function addPassfile() {
    const passPhrase = await askPassword({
        question: t("Passfile.AskPassphraseForNewPassfile"),
    });

    if (!passPhrase) {
        return;
    }

    const result = await context.create({ passPhrase });
    if (result.ok) {
        const passfile = result.data!;
        passfile.name =
            `New ${new Date().getFullYear()}${new Date().getMonth() + 1}` +
            `${new Date().getDate()}-${new Date().getHours()}${new Date().getMinutes()}`;

        context.updateInfo(passfile);
    }
}

function addSection() {
    selected.value?.content.decrypted?.push({
        id: crypto.randomUUID(),
        name:
            `New section ${new Date().getFullYear()}${new Date().getMonth() + 1}` +
            `${new Date().getDate()}-${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`,
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
            @add-passfile="addPassfile"
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
