<script setup lang="ts">
import { ref, useId } from "vue";
import { t, useAppContext } from "~stores";
import { AuthApi } from "~entities/backend";
import { UserApi } from "~entities/user";

const emit = defineEmits<{ (e: "signed"): void }>();

const { currentUser } = useAppContext();

const login = ref("");
const password = ref("");

async function signIn() {
    currentUser.value = await AuthApi.logIn({
        login: login.value,
        password: password.value,
    });

    emit("signed");
}

async function signUp() {
    currentUser.value = await UserApi.post({
        fullName: "Unknown",
        login: login.value,
        password: password.value,
    });

    emit("signed");
}

const loginInputId = useId();
const passwordInputId = useId();
</script>

<template>
    <PmCard class="min-w-[300px]">
        <template #title>
            {{ t("Auth.Title") }}
        </template>

        <template #content>
            <div class="flex flex-col gap-4 pt-4 sm:min-w-[320px]">
                <PmFloatLabel variant="in">
                    <PmInputText
                        :id="loginInputId"
                        v-model="login"
                        class="w-full"
                        name="login"
                        @keydown.enter="signIn"
                    />
                    <label :for="loginInputId">{{ t("Auth.LoginLabel") }}</label>
                </PmFloatLabel>

                <PmFloatLabel variant="in">
                    <PmInputPassword
                        v-model="password"
                        :input-id="passwordInputId"
                        class="w-full"
                        name="password"
                        toggle-mask
                        :feedback="false"
                        @keydown.enter="signIn"
                    />
                    <label :for="passwordInputId">{{ t("Auth.PasswordLabel") }}</label>
                </PmFloatLabel>
            </div>
        </template>

        <template #footer>
            <div class="flex gap-2 pt-5">
                <PmButton class="flex-1 px-6" :label="t('Auth.SignInButton')" raised @click.stop="signIn" />
                <PmButton
                    class="min-w-[50%] px-6"
                    :label="t('Auth.SignUpButton')"
                    severity="secondary"
                    variant="outlined"
                    raised
                    @click.stop="signUp"
                />
            </div>
        </template>
    </PmCard>
</template>
