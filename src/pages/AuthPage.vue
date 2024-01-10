<script setup lang="ts">
import { ref } from "vue";
import { PassMetaApi } from "~api";
import { AppContext } from "~stores/appContext";
import { useRouter } from "vue-router";
import { Routes } from "~routing/routes";

const login = ref("");
const password = ref("");

const router = useRouter();

async function signIn() {
    const user = await PassMetaApi.auth.logIn.execute({
        login: login.value,
        password: password.value,
    });

    AppContext.setUser(user);
    await router.push(Routes.Storage.to());
}

async function signUp() {
    const user = await PassMetaApi.user.post.execute({
        login: login.value,
        password: password.value,
    });

    AppContext.setUser(user);
    await router.push(Routes.Storage.to());
}
</script>

<template>
  <div class="grid h-full w-full justify-center align-center">
    <v-card class="min-w-[300px]" :title="$t('Auth.Title')" variant="tonal">
      <v-card-item>
        <v-text-field
          v-model="login"
          :label="$t('Auth.LoginLabel')"
          name="login"
          variant="underlined"
          clearable
          @keydown.enter="signIn"
        />

        <v-text-field
          v-model="password"
          :label="$t('Auth.PasswordLabel')"
          name="password"
          variant="underlined"
          type="password"
          clearable
          @keydown.enter="signIn"
        />
      </v-card-item>

      <v-card-actions>
        <v-btn variant="tonal" @click.stop="signIn">{{ $t("Auth.SignInButton") }}</v-btn>
        <v-btn variant="tonal" @click.stop="signUp">{{ $t("Auth.SignUpButton") }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
