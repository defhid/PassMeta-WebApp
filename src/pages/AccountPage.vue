<script setup lang="ts">
import { AppContext } from "~stores/appContext";
import { PassMetaApi } from "~api";
import { Ask } from "~utils/ask";
import { t } from "~plugins/localePlugin";
import { Notify } from "~utils/notify";

async function closeAllSessions() {
    if (!await Ask.confirm(t("Account.ConfirmResetSessions"))) {
        return;
    }

    await PassMetaApi.auth.resetAllExceptMe.execute();

    Notify.info(t("Account.SuccessResetSessions"));
}
</script>

<template>
  <div class="p-4">
    <h4 class="text-h4 text-center mt-2">{{ $t("Account.Title") }}</h4>

    <div class="grid grid-cols-[auto_1fr] gap-y-3 gap-x-5 mt-7">
      <b>{{ $t("Account.LabelName") }}:</b>
      <span class="text-medium-emphasis">{{ AppContext.user!.fullName }}</span>

      <b>{{ $t("Account.LabelLogin") }}:</b>
      <span class="text-medium-emphasis">{{ AppContext.user!.login }}</span>
    </div>

    <v-btn class="mt-10" size="small" @click.stop="closeAllSessions">
      {{ $t("Account.BtnResetSessions") }}
    </v-btn>
  </div>
</template>
