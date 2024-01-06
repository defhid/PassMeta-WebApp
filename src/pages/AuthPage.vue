<script setup lang="ts">
import { onMounted, ref } from "vue";
import { PassMetaApi } from "@/api";

const info = ref({});

onMounted(async () => {
    info.value = await PassMetaApi.general.getInfo.execute();
});
</script>

<template>
  <div class="grid h-full w-full justify-center align-center">
    <v-card :title="$t('Auth.Title')" variant="tonal">
      <v-card-item>
        <v-text-field :label="$t('Auth.LoginLabel')" variant="underlined" clearable />
        <v-text-field :label="$t('Auth.PasswordLabel')" variant="underlined" clearable />
      </v-card-item>

      <v-card-actions>
        <v-btn variant="tonal">{{ $t('Auth.SignInButton') }}</v-btn>
        <v-btn variant="tonal">{{ $t('Auth.SignUpButton') }}</v-btn>
      </v-card-actions>
    </v-card>

    <div class="float-end">
      <strong>INFO:</strong> {{ JSON.stringify(info) }}
    </div>
  </div>
</template>
