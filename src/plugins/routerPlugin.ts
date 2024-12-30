import { type App, watch } from "vue";
import { createRouter, createWebHistory, type RouteLocationNormalized, type Router } from "vue-router";
import { AppContext } from "~stores";
import { initializeRoutes, type RouteInfo } from "~infra/routing";
import { Routes } from "~routing";
import { Pages } from "~pages";

let currentRoute: RouteLocationNormalized | null = null;

export default {
    install(app: App) {
        const router = createRouter({
            history: createWebHistory(),
            routes: initializeRoutes(Routes, Pages),
        });

        router.beforeEach((to) => {
            currentRoute = to;
            return ensureRouteLegal(router);
        });

        watch(
            () => AppContext.isLoaded,
            () => ensureRouteLegal(router),
            { immediate: true },
        );

        app.use(router);
    },
};

async function ensureRouteLegal(router: Router) {
    if (!AppContext.isLoaded) {
        return;
    }

    const isAuthenticated = AppContext.user != null;
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
