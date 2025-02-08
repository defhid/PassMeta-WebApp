import { defineRouteSchemas } from "~infra";
import { useAppSettings } from "~stores";

export const Routes = defineRouteSchemas(
    {
        Home: {
            path: "",
            anonymous: true,
        },
        Auth: {
            path: "auth",
            anonymous: true,
            queryParams: {} as { redirectUrl?: string },
        },
        About: {
            path: "about",
            anonymous: true,
        },
        Account: {
            path: "account",
        },
        Storage: {
            path: "storage",
        },
        Generator: {
            path: "generator",
            anonymous: true,
        },
        History: {
            path: "history",
        },
        Settings: {
            path: "settings",
            anonymous: true,
        },
        NotFound: {
            path: ":pathMatch(.*)*",
            anonymous: true,
        },
    },
    {
        rootParams: () => ({ locale: useAppSettings().locale }),
        rootPath: "/:locale",
    },
);
