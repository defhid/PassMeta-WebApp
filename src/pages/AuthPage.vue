<script setup lang="ts">
import { ref } from "vue";
import { PassMetaApi } from "@api";
import { useUserStore } from "@stores/userStore";
import { useRouter } from "vue-router";

const login = ref("");
const password = ref("");

const router = useRouter();
const userStore = useUserStore();

async function signIn() {
    const user = await PassMetaApi.auth.logIn.execute({
        login: login.value,
        password: password.value,
    });

    userStore.setUser(user);
    await router.push({ name: "Storage" });
}

async function signUp() {
    const user = await PassMetaApi.user.post.execute({
        login: login.value,
        password: password.value,
    });

    userStore.setUser(user);
    await router.push({ name: "Storage" });
}
</script>

<template>
  <div class="grid h-full w-full justify-center align-center">
    <v-card :title="$t('Auth.Title')" variant="tonal">
      <v-card-item>
        <v-text-field
          v-model="login"
          :label="$t('Auth.LoginLabel')"
          variant="underlined"
          clearable
        />

        <v-text-field
          v-model="password"
          :label="$t('Auth.PasswordLabel')"
          variant="underlined"
          type="password"
          clearable
        />
      </v-card-item>

      <v-card-actions>
        <v-btn variant="tonal" @click.stop="signIn">{{ $t("Auth.SignInButton") }}</v-btn>
        <v-btn variant="tonal" @click.stop="signUp">{{ $t("Auth.SignUpButton") }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
