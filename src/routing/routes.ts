import DesktopPage from "@pages/HomePage.vue";
import StoragePage from "@pages/StoragePage.vue";
import type { RouteRecordRaw } from "vue-router";
import { LocaleHelper } from "@utils/localeHelper";
import { useUserStore } from "@stores/userStore";

export function buildRoutes(): RouteRecordRaw[] {
    return [
        {
            path: "/",
            redirect: () => ({
                name: useUserStore().isAuthenticated ? "Storage" : "Home",
                params: { locale: LocaleHelper.getUserLocale() },
            }),
        },
        {
            path: "/:locale/auth",
            name: "Auth",
            component: () => import("@pages/AuthPage.vue"),
        },
        {
            path: "/:locale/storage",
            name: "Storage",
            component: StoragePage,
        },
        {
            path: "/:locale/home",
            name: "Home",
            component: DesktopPage,
        },
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: () => import("@pages/NotFoundPage.vue"),
        },
    ];
}
