import { Ask, Notify } from "~utils";
import { t, useAppContext } from "~stores";
import { PassMetaApi } from "~api";
import { Routes } from "~routing";
import { useRouter } from "vue-router";

/**
 * Use session closing methods for current user.
 */
export function useSessionClose() {
    const router = useRouter();
    const { currentUser } = useAppContext();

    async function closeAllSessions() {
        if (!(await Ask.confirm(t("Account.ConfirmResetAllSessions")))) {
            return;
        }

        await PassMetaApi.auth.resetAllExceptMe();

        Notify.info(t("Account.SuccessResetSessions"));
    }

    async function closeCurrentSession() {
        if (!(await Ask.confirm(t("Account.ConfirmResetCurrentSession")))) {
            return;
        }

        await PassMetaApi.auth.resetMe();

        await router.push(Routes.Home.to());
        currentUser.value = undefined;
    }

    return {
        closeAllSessions,
        closeCurrentSession,
    };
}
