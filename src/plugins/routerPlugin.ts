import { type App, watch, type Plugin } from "vue";
import { createRouter, createWebHistory, type RouteLocationNormalized, type Router } from "vue-router";
import { useAppContext } from "~stores";
import { initializeRoutes, type RouteInfo } from "~infra";
import { Routes } from "~routing";
import { Pages } from "~pages";
import type { UserDto } from "~generated/api";

const routerPlugin: Plugin = (app: App) => {
    const router = createRouter({
        history: createWebHistory(),
        routes: initializeRoutes(Routes, Pages),
    });

    const context = useAppContext();

    const isReady = Promise.all([router.isReady(), context.isReady()]);

    isReady.then(() => {
        router.beforeEach((to) => ensureRouteLegal(router, to, context.currentUser.value));

        watch(context.currentUser, (user) => ensureRouteLegal(router, router.currentRoute.value, user), {
            immediate: true,
        });
    });

    app.use(router);
};

async function ensureRouteLegal(router: Router, route: RouteLocationNormalized, user: UserDto | undefined) {
    const isAuthenticated = user != null;
    const routeInfo = route.meta.info as RouteInfo<any, any> | undefined;

    if (routeInfo == null) {
        return;
    }

    if (!routeInfo.to.isAnonymous && !isAuthenticated) {
        await router.push(
            Routes.Auth.to({
                queryParams: { redirectUrl: route.fullPath },
            }),
        );
        return;
    }

    if (route.name === Routes.Auth.to.name && isAuthenticated) {
        await router.push(Routes.Storage.to());
        return;
    }
}

export default routerPlugin;
