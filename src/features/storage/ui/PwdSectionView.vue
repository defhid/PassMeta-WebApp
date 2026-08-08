<script setup lang="ts">
import type { PwdItem, PwdSection } from "~entities/passfile";
import { normalizeExternalUrl } from "~utils";
import PwdItemView from "~features/storage/ui/PwdItemView.vue";
import { ref, toRaw, watch } from "vue";
import { t } from "~stores";
import PwdItemEditView from "~features/storage/ui/PwdItemEditView.vue";

const props = defineProps<{
    section: PwdSection;
    isNew: boolean;
}>();

const emit = defineEmits<{
    back: [];
    edit: [];
    delete: [];
}>();

const editMode = defineModel<boolean>("editMode", { required: true });

const cloneSection = () => ({ ...props.section, items: props.section.items.map((x) => ({ ...x })) });
const localSection = ref(cloneSection());

watch(
    () => props.section,
    () => (localSection.value = cloneSection()),
);

function addItem() {
    !editMode.value && switchEdit();

    localSection.value.items.push({
        usernames: [],
        password: "",
        remark: "",
        totp: null,
    });
}

function deleteItem(item: PwdItem) {
    !editMode.value && switchEdit();

    const index = toRaw(localSection.value.items).indexOf(toRaw(item));
    if (index >= 0) {
        localSection.value.items.splice(index, 1);
    }
}

function moveItem(item: PwdItem, direction: 1 | -1) {
    !editMode.value && switchEdit();

    const index = toRaw(localSection.value.items).indexOf(toRaw(item));
    if (index >= 0) {
        const [tmp] = localSection.value.items.splice(index, 1);
        localSection.value.items.splice(index + direction, 0, tmp);
    }
}

function switchEdit() {
    if (!editMode.value) {
        localSection.value = cloneSection();
        editMode.value = true;
        return;
    }

    Object.assign(props.section, localSection.value);
    emit("edit");
    editMode.value = false;
}

function rollback() {
    if (props.isNew) {
        emit("delete");
    } else {
        localSection.value = cloneSection();
    }
    editMode.value = false;
}

function onFocusName(ev: FocusEvent) {
    if (props.isNew) {
        const input = ev.target as HTMLInputElement;
        input.select();
    }
}
</script>

<template>
    <div class="pwd-section-card">
        <div
            :key="'editable' + editMode"
            v-focustrap="{ disabled: !isNew }"
            class="flex flex-col justify-items-stretch h-full min-h-0"
        >
            <div v-if="editMode" class="flex flex-col flex-1 gap-2 pt-2">
                <PmFloatLabel variant="in">
                    <PmInputText v-model="localSection.name" autofocus fluid @focus="onFocusName" />
                    <label>{{ t("Storage.SectionNameField.Label") }}</label>
                </PmFloatLabel>

                <PmInputText v-model="localSection.websiteUrl" placeholder="https://" fluid />
            </div>

            <div v-else class="flex flex-wrap items-center pb-1 md:px-3 gap-x-2 gap-y-3">
                <div class="grid grid-cols-[auto_auto] items-center gap-3">
                    <div class="md:hidden">
                        <PmButton icon-only severity="secondary" rounded @click.stop="emit('back')">
                            <i class="pi pi-arrow-left button-icon-lg" />
                        </PmButton>
                    </div>
                    <h5 class="text-xl truncate">{{ localSection.name }}</h5>
                </div>

                <PmButton
                    v-if="localSection.websiteUrl"
                    variant="outlined"
                    class="italic break-all leading-5"
                    size="small"
                    as="a"
                    :href="normalizeExternalUrl(localSection.websiteUrl)"
                    target="_blank"
                >
                    {{ localSection.websiteUrl }}
                </PmButton>
            </div>

            <div class="h-full overflow-y-auto mt-2.5 px-2 md:mt-3 md:px-3 pb-20">
                <div v-if="editMode" class="grid gap-2 mb-2">
                    <PwdItemEditView
                        v-for="(item, i) in localSection.items"
                        :key="i"
                        :item="item"
                        :can-up="i !== 0"
                        :can-down="i !== localSection.items.length - 1"
                        @delete="deleteItem(item)"
                        @up="moveItem(item, -1)"
                        @down="moveItem(item, 1)"
                    />
                </div>
                <div v-else class="grid gap-2">
                    <PwdItemView v-for="(item, i) in localSection.items" :key="i" :item="item" />
                </div>

                <PmButton v-if="editMode" severity="success" icon-only size="large" @click.stop="addItem">
                    <i class="pi pi-plus" />
                </PmButton>
            </div>

            <div class="flex gap-2 absolute z-10 left-0 right-0 bottom-0 backdrop-blur-[2px]">
                <template v-if="editMode">
                    <PmButton class="btn-edit" severity="contrast" @click.stop="switchEdit">
                        <i class="pi pi-check button-icon-lg" />
                    </PmButton>
                    <PmButton class="btn-edit" severity="contrast" @click.stop="rollback">
                        <i class="pi pi-times button-icon-xl" />
                    </PmButton>
                    <PmButton v-if="!props.isNew" class="btn-edit" severity="danger" @click.stop="emit('delete')">
                        <i class="pi pi-trash button-icon-lg" />
                    </PmButton>
                </template>
                <template v-else>
                    <PmButton class="btn-edit" severity="secondary" @click.stop="switchEdit">
                        <i class="pi pi-sliders-h button-icon-lg" />
                    </PmButton>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pwd-section-card {
    --p-card-body-padding: 8px 8px 0 8px;
    min-width: 0;
    min-height: 0;
    height: 100%;
    position: relative;
}
.btn-edit {
    height: 40px;
    width: 100%;
    opacity: 0.7;
}
</style>
