import { Routes } from "~routing";
import HomePage from "./HomePage.vue";
import AccountPage from "./AccountPage.vue";
import StoragePage from "./StoragePage.vue";
import GeneratorPage from "./GeneratorPage.vue";
import HistoryPage from "./HistoryPage.vue";
import SettingsPage from "./SettingsPage.vue";
import { definePages } from "~infra";
import AboutPage from "~/pages/AboutPage.vue";

export * from "./routing";
export { default as NavBar } from "./components/NavBar.vue";

export const Pages = definePages([
    {
        route: Routes.Home,
        component: HomePage,
    },
    {
        route: Routes.Auth,
        component: () => import("./AuthPage.vue"),
    },
    {
        route: Routes.About,
        component: AboutPage,
    },
    {
        route: Routes.Account,
        component: AccountPage,
    },
    {
        route: Routes.Storage,
        component: StoragePage,
    },
    {
        route: Routes.Generator,
        component: GeneratorPage,
    },
    {
        route: Routes.History,
        component: HistoryPage,
    },
    {
        route: Routes.Settings,
        component: SettingsPage,
    },
    {
        route: Routes.NotFound,
        component: () => import("./NotFoundPage.vue"),
    },
]);
