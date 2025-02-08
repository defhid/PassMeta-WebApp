<script setup lang="ts">
import { AuthCard } from "~features/auth";
import { Routes } from "~routing";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
    <div class="grid h-full w-full justify-center align-center">
        <AuthCard @signed="router.push(Routes.Storage.to())" />
    </div>
</template>
