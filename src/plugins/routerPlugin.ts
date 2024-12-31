import { type App, watch, type Plugin } from "vue";
import { createRouter, createWebHistory, type RouteLocationNormalized, type Router } from "vue-router";
import { useAppContext } from "~stores";
import { initializeRoutes, type RouteInfo } from "~infra";
import { Routes } from "~routing";
import { Pages } from "~pages";
import type { UserDto } from "~generated/api";

let currentRoute: RouteLocationNormalized | null = null;

const routerPlugin: Plugin = (app: App) => {
    const router = createRouter({
        history: createWebHistory(),
        routes: initializeRoutes(Routes, Pages),
    });

    const { isContextLoaded, currentUser } = useAppContext();

    router.beforeEach((to) => {
        currentRoute = to;
        return ensureRouteLegal(router, currentUser.value, isContextLoaded.value);
    });

    watch(
        [currentUser.value, isContextLoaded.value],
        ([user, loaded]: [UserDto | undefined, boolean]) => ensureRouteLegal(router, user, loaded),
        { immediate: true },
    );

    app.use(router);
};

async function ensureRouteLegal(router: Router, user: UserDto | undefined, isAppContextLoaded: boolean) {
    if (!isAppContextLoaded) {
        return;
    }

    const isAuthenticated = user != null;
    const routeInfo = currentRoute!.meta.info as RouteInfo<any, any> | undefined;

    if (routeInfo == null) {
        return;
    }

    if (!routeInfo.to.isAnonymous && !isAuthenticated) {
        await router.push(
            Routes.Auth.to({
                queryParams: { redirectUrl: currentRoute!.fullPath },
            }),
        );
        return;
    }

    if (currentRoute!.name === Routes.Auth.to.name && isAuthenticated) {
        await router.push(Routes.Storage.to());
        return;
    }
}

export default routerPlugin;
