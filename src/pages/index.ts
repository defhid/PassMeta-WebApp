import { Routes } from "~routing";
import HomePage from "./HomePage.vue";
import AccountPage from "./AccountPage.vue";
import StoragePage from "./StoragePage.vue";
import GeneratorPage from "./GeneratorPage.vue";
import HistoryPage from "./HistoryPage.vue";
import { definePages } from "~infra";

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
        route: Routes.NotFound,
        component: () => import("./NotFoundPage.vue"),
    },
]);
