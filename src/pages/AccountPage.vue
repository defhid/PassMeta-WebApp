<script setup lang="ts">
import { t } from "~stores";
import { ViewerInfo } from "~entities/viewer";
import { useSessionClose } from "~features/auth";

const { closeAllSessions, closeCurrentSession } = useSessionClose();
</script>

<template>
    <div class="p-4">
        <h4 class="text-h4 text-center mt-2">{{ t("Account.Title") }}</h4>

        <ViewerInfo @reset-all-sessions="closeAllSessions()" @reset-current-session="closeCurrentSession()" />
    </div>
</template>
