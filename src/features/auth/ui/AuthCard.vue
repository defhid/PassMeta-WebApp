<script setup lang="ts">
import { ref } from "vue";
import { t, useAppContext } from "~stores";
import { useRouter } from "vue-router";
import { Routes } from "~routing";
import { AuthApi } from "~entities/backend";
import { UserApi } from "~entities/user";

const router = useRouter();
const { currentUser } = useAppContext();

const login = ref("");
const password = ref("");

async function signIn() {
    currentUser.value = await AuthApi.logIn({
        login: login.value,
        password: password.value,
    });

    await router.push(Routes.Storage.to());
}

async function signUp() {
    currentUser.value = await UserApi.post({
        fullName: "Unknown",
        login: login.value,
        password: password.value,
    });

    await router.push(Routes.Storage.to());
}
</script>

<template>
    <v-card class="min-w-[300px]" :title="t('Auth.Title')" variant="tonal">
        <v-card-item>
            <v-text-field
                v-model="login"
                :label="t('Auth.LoginLabel')"
                name="login"
                variant="underlined"
                @keydown.enter="signIn"
            />

            <v-text-field
                v-model="password"
                :label="t('Auth.PasswordLabel')"
                name="password"
                variant="underlined"
                type="password"
                @keydown.enter="signIn"
            />
        </v-card-item>

        <v-card-actions>
            <v-btn variant="tonal" @click.stop="signIn">{{ t("Auth.SignInButton") }}</v-btn>
            <v-btn variant="tonal" @click.stop="signUp">{{ t("Auth.SignUpButton") }}</v-btn>
        </v-card-actions>
    </v-card>
</template>
