import { Ask, Notify } from "~utils";
import { t } from "~stores";
import { type RouteLocationRaw, useRouter } from "vue-router";
import { AuthApi } from "~entities/backend";
import { usePassFileLocalStorage } from "~features/storage/utils/passFileLocalStorage";

/**
 * Use session closing methods for current user.
 */
export function useSessionClose() {
    const router = useRouter();

    async function closeAllSessions() {
        if (!(await Ask.confirm(t("Account.ConfirmResetAllSessions")))) {
            return;
        }

        await AuthApi.resetAllExceptMe();

        Notify.success(t("Account.SuccessResetSessions"));
    }

    async function closeCurrentSession(redirectTo: RouteLocationRaw) {
        if (!(await Ask.confirm(t("Account.ConfirmResetCurrentSession")))) {
            return;
        }

        await AuthApi.resetMe();
        await usePassFileLocalStorage().truncate();

        const location = router.resolve(redirectTo);
        window.location.assign(location.href);
    }

    return {
        closeAllSessions,
        closeCurrentSession,
    };
}
