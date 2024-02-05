import { Ask, Notify } from "~utils";
import { AppContext, t } from "~stores";
import { PassMetaApi } from "~api";
import type { Router } from "vue-router";
import { Routes } from "~routing";

export async function closeAllSessions() {
    if (!await Ask.confirm(t("Account.ConfirmResetAllSessions"))) {
        return;
    }

    await PassMetaApi.auth.resetAllExceptMe.execute();

    Notify.info(t("Account.SuccessResetSessions"));
}

export async function closeCurrentSession(router: Router) {
    if (!await Ask.confirm(t("Account.ConfirmResetCurrentSession"))) {
        return;
    }

    await PassMetaApi.auth.resetMe.execute();

    await router.push(Routes.Home.to());
    AppContext.setUser(null);
}
