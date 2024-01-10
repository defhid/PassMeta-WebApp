import { type App, watch } from "vue";
import {
    createRouter,
    createWebHistory,
    type RouteLocationNormalized,
    type Router,
} from "vue-router";
import { buildRawRoutes, type RouteInfo, Routes } from "~routing/routes";
import { AppContext } from "~stores/appContext";

let currentRoute: RouteLocationNormalized | null = null;

export default {
    install(app: App) {
        const router = createRouter({
            history: createWebHistory(),
            routes: buildRawRoutes(),
        });

        router.beforeEach((to) => {
            currentRoute = to;
            return ensureRouteLegal(router);
        });

        watch(
            () => AppContext.isLoaded,
            () => ensureRouteLegal(router),
            { immediate: true });

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

    if (!routeInfo.anonymous && !isAuthenticated) {
        await router.push(Routes.Auth.to({ queryParams: { redirectUrl: currentRoute!.fullPath } }));
        return;
    }

    if (currentRoute!.name === Routes.Auth.name && isAuthenticated) {
        await router.push(Routes.Storage.to());
        return;
    }
}
