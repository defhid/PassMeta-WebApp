<script setup lang="ts">
import { t } from "~stores";
import { useRouter } from "vue-router";
import { ViewerInfo } from "~entities/viewer";
import { closeAllSessions, closeCurrentSession } from "~features/auth";

const router = useRouter();
</script>

<template>
    <div class="p-4">
        <h4 class="text-h4 text-center mt-2">{{ t("Account.Title") }}</h4>

        <ViewerInfo @reset-all-sessions="closeAllSessions()" @reset-current-session="closeCurrentSession(router)" />
    </div>
</template>
