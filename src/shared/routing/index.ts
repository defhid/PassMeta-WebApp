import { defineRouteSchemas } from "~infra";
import { getAppLocale } from "~stores";

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
        Account: {
            path: "account",
        },
        Storage: {
            path: "storage",
        },
        Generator: {
            path: "generator",
        },
        History: {
            path: "history",
        },
        NotFound: {
            path: ":pathMatch(.*)*",
            anonymous: true,
        },
    },
    {
        rootParams: () => ({ locale: getAppLocale() }),
        rootPath: "/:locale",
    },
);
