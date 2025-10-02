<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { decryptPassFile, type PwdPassFile, type PwdSection } from "~entities/passfile";
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
import { Ask } from "~utils";

const context = usePwdPassFileContext();

onMounted(() => synchronizePassFiles(context));

const selected = ref<PwdPassFile>();
const selectedSection = ref<PwdSection>();
const selectedSectionEditMode = ref(false);
const selectedSectionIsNew = ref(false);

watch(
    selectedSection,
    () => {
        selectedSectionEditMode.value = false;
        selectedSectionIsNew.value = false;
    },
    { flush: "sync" },
);

async function openPassFile(passFile: PwdPassFile) {
    alert(JSON.stringify({ ...passFile, content: undefined }, undefined, 4));

    const name = await askText({ question: "New passfile name" });
    if (name) {
        passFile.name = name;
        const ok = context.updateInfo(passFile);
        ok && (await synchronizePassFiles(context));
    }
}

const { askText } = useDialogs();
const { askLooped } = usePassPhraseAskHelper();

watch(
    selected,
    async (passFile, prevPassFile) => {
        if (!passFile || passFile.content.decrypted) {
            selectedSection.value = undefined;
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

watch(
    () => [selected.value, selected.value?.content.decrypted],
    async (_curr, prev) => {
        if (selected.value && selected.value === prev[0]) {
            if (!selected.value.content.decrypted && selected.value.content.passPhrase) {
                (await context.provideEncryptedContent(selected.value)) &&
                    (await decryptPassFile(selected.value, selected.value.content.passPhrase));
            }
        }
    },
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

        const ok = context.updateInfo(passfile);
        ok && (await synchronizePassFiles(context));
    }
}

function addSection() {
    const section: PwdSection = {
        id: crypto.randomUUID(),
        name: t("Storage.SectionNewName"),
        websiteUrl: "",
        items: [
            {
                usernames: [],
                password: "",
                remark: "",
            },
        ],
    };

    selected.value?.content.decrypted?.push(section);
    selectedSection.value = section;
    selectedSectionIsNew.value = true;
    selectedSectionEditMode.value = true;
}

function editSection() {
    const ok = selected.value && context.updateContent(selected.value);
    ok && synchronizePassFiles(context);
}

async function deleteSection() {
    if (selected.value && selectedSection.value) {
        if (!selectedSectionIsNew.value) {
            const confirmed = await Ask.confirm(
                t("Storage.Confirm.DeleteSection", { section: selectedSection.value.name }),
            );
            if (!confirmed) {
                return;
            }
        }

        const sectionId = selectedSection.value.id;

        selected.value.content = {
            decrypted: selected.value.content.decrypted!.filter((x) => x.id !== sectionId),
            passPhrase: selected.value.content.passPhrase,
        };

        if (!selectedSectionIsNew.value) {
            const ok = context.updateContent(selected.value);
            ok && synchronizePassFiles(context);
        }

        selectedSection.value = undefined;
    }
}
</script>

<template>
    <div class="h-full grid md:grid-cols-[25%_25%_1fr] 2xl:grid-cols-[400px_400px_1fr] gap-2">
        <PassFileListView
            v-model:selected="selected"
            class="h-full md:block"
            :class="{ hidden: selected }"
            :pass-files="context.currentList.value"
            :disabled="selectedSectionEditMode"
            @open="openPassFile"
            @add-passfile="addPassfile"
        />

        <PwdSectionListView
            v-if="selected?.content.decrypted"
            v-model:selected="selectedSection"
            class="h-full md:block"
            :class="{ hidden: selectedSection }"
            :sections="selected.content.decrypted"
            :disabled="selectedSectionEditMode"
            @back="selected = undefined"
            @add-section="addSection"
        />

        <PwdSectionView
            v-if="selectedSection"
            v-model:edit-mode="selectedSectionEditMode"
            class="h-full"
            :section="selectedSection"
            :is-new="selectedSectionIsNew"
            @back="selectedSection = undefined"
            @edit="editSection"
            @delete="deleteSection"
        />
    </div>
</template>
