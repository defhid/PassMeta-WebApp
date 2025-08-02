<script setup lang="ts">
import type { PwdSection } from "~entities/passfile";
import { normalizeExternalUrl } from "~utils";
import PwdItemView from "~features/storage/ui/PwdItemView.vue";
import { ref, watch } from "vue";

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
</script>

<template>
    <PmCard class="pwd-section-card">
        <template #content>
            <div class="flex flex-col justify-items-stretch h-full min-h-0">
                <div class="flex flex-wrap items-center pt-2 pb-1 md:px-3 gap-x-2 gap-y-3">
                    <div class="grid grid-cols-[auto_auto] items-center gap-3">
                        <div class="md:hidden">
                            <PmButton icon="pi pi-arrow-left" severity="secondary" rounded @click.stop="emit('back')" />
                        </div>
                        <h5 class="text-xl truncate">{{ localSection.name }}</h5>
                    </div>

                    <PmButton
                        v-if="localSection.websiteUrl"
                        variant="text"
                        class="italic"
                        :label="localSection.websiteUrl"
                        as="a"
                        :href="normalizeExternalUrl(localSection.websiteUrl)"
                        target="_blank"
                    />
                </div>

                <div class="h-full overflow-y-auto mt-2.5 md:mt-3 md:px-3">
                    <div class="grid gap-2 pb-12">
                        <PwdItemView
                            v-for="(item, i) in localSection.items"
                            :key="i"
                            :item="item"
                            :readonly="!editMode"
                        />
                    </div>
                </div>

                <div class="flex gap-2 absolute z-10 left-0 right-0 bottom-0 backdrop-blur-[2px]">
                    <PmButton
                        v-if="!editMode"
                        class="btn-edit"
                        icon="pi pi-sliders-h"
                        severity="secondary"
                        @click.stop="switchEdit"
                    />
                    <PmButton
                        v-if="editMode"
                        class="btn-edit"
                        icon="pi pi-check"
                        severity="secondary"
                        @click.stop="switchEdit"
                    />
                    <PmButton
                        v-if="editMode"
                        class="btn-edit"
                        icon="pi pi-times"
                        severity="secondary"
                        @click.stop="rollback"
                    />
                    <PmButton
                        v-if="editMode && !props.isNew"
                        class="btn-edit w-auto min-w-[70px]"
                        icon="pi pi-trash"
                        severity="secondary"
                        @click.stop="emit('delete')"
                    />
                </div>
            </div>
        </template>
    </PmCard>
</template>

<style scoped>
.pwd-section-card {
    --p-card-body-padding: 8px 8px 0 8px;
    min-height: 0;
    height: 100%;
    position: relative;
}
.btn-edit {
    height: 40px;
    width: 100%;
    border-radius: var(--p-card-border-radius);
    opacity: 0.5;
}
</style>
