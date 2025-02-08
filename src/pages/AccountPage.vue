<script setup lang="ts">
import { t } from "~stores";
import { ViewerInfo } from "~features/viewer";
import { useSessionClose } from "~entities/backend";
import { Routes } from "~routing";

const { closeAllSessions, closeCurrentSession } = useSessionClose();
</script>

<template>
    <div class="p-4">
        <h4 class="text-h4 text-center mt-2">{{ t("Account.Title") }}</h4>

        <ViewerInfo
            @close-current-session="closeCurrentSession(Routes.Home.to())"
            @close-all-sessions="closeAllSessions()"
        />
    </div>
</template>
