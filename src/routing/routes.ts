import HomePage from "~pages/HomePage.vue";
import StoragePage from "~pages/StoragePage.vue";
import AccountPage from "~pages/AccountPage.vue";
import GeneratorPage from "~pages/GeneratorPage.vue";
import HistoryPage from "~pages/HistoryPage.vue";
import type { RouteLocationRaw, RouteRecordRaw } from "vue-router";
import { LocaleHelper } from "~utils/localeHelper";
import { AppContext } from "~stores/appContext";

export interface RouteInfo<
    TRouteParams extends Record<string, any> | undefined,
    TQueryParams extends Record<string, any> | undefined
> {
    readonly name: string;
    readonly anonymous: boolean;
    readonly to: TRouteParams extends Partial<TRouteParams>
        ? TQueryParams extends Partial<TQueryParams>
            ? (options?: { queryParams?: TQueryParams, routeParams?: TRouteParams })
                => RouteLocationRaw
            : (options: { queryParams: TQueryParams, routeParams?: TRouteParams })
                => RouteLocationRaw
        : TQueryParams extends Partial<TQueryParams>
            ? (options: { routeParams: TRouteParams, queryParams?: TQueryParams })
                => RouteLocationRaw
            : (options: { routeParams: TRouteParams, queryParams: TQueryParams })
                => RouteLocationRaw;
}

function defineRoutes<
    T extends Record<
        string,
        Omit<RouteRecordRaw, "name"> &
        {
            routeParams?: Record<string, any>,
            queryParams?: Record<string, any>,
            anonymous?: boolean,
        }>
>(routes: T): Readonly<{
    [TKey in keyof T]:
    RouteRecordRaw &
    RouteInfo<
        T[TKey] extends { routeParams: any } ? T[TKey]["routeParams"] : undefined,
        T[TKey] extends { queryParams: any } ? T[TKey]["queryParams"] : undefined>
}> {
    for (const key in routes) {
        (routes[key] as Record<string, any>).name = key;
        (routes[key] as Record<string, any>).anonymous = routes[key].anonymous ?? false;
        (routes[key] as Record<string, any>).to =
            ((options?: { routeParams: any, queryParams: any }) => ({
                name: key,
                params: {
                    locale: LocaleHelper.getUserLocale(),
                    ...options?.routeParams,
                },
                query: options?.queryParams,
            })) as RouteInfo<any, any>["to"];
    }

    return routes as any;
}

export const Routes = defineRoutes({
    Auth: {
        path: "/:locale/auth",
        anonymous: true,
        component: () => import("~pages/AuthPage.vue"),
        queryParams: {} as { redirectUrl?: string },
    },
    Account: {
        path: "/:locale/account",
        component: AccountPage,
    },
    Storage: {
        path: "/:locale/storage",
        component: StoragePage,
    },
    Generator: {
        path: "/:locale/generator",
        component: GeneratorPage,
    },
    History: {
        path: "/:locale/history",
        component: HistoryPage,
    },
    Home: {
        path: "/:locale/home",
        anonymous: true,
        component: HomePage,
    },
    NotFound: {
        path: "/:pathMatch(.*)*",
        anonymous: true,
        component: () => import("~pages/NotFoundPage.vue"),
    },
});

export function buildRawRoutes(): RouteRecordRaw[] {
    return [
        {
            path: "/",
            redirect: () => AppContext.user == null
                ? Routes.Home.to()
                : Routes.Storage.to(),
        },
        ...Object.values(Routes).map(x => ({
            name: x.name,
            path: x.path,
            component: x.component,
            children: [],
            meta: { info: x },
        })),
    ];
}
