<script setup lang="ts">
import { t } from "~stores";
import { ViewerInfo } from "~features/viewer";
</script>

<template>
    <div class="p-4">
        <h4 class="text-h4 text-center mt-2">{{ t("Account.Title") }}</h4>

        <ViewerInfo />
    </div>
</template>
