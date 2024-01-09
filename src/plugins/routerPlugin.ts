import { type App, watch } from "vue";
import {
    createRouter,
    createWebHistory,
    type RouteLocationNormalized,
    type Router,
} from "vue-router";
import { buildRawRoutes, type RouteInfo, Routes } from "@routing/routes";
import { AppContext } from "@stores/appContext";

export default {
    install(app: App) {
        const router = createRouter({
            history: createWebHistory(),
            routes: buildRawRoutes(),
        });

        router.beforeEach((to) => ensureRouteLegal(router, to));

        watch(
            () => AppContext.isLoaded,
            () => ensureRouteLegal(router, router.currentRoute.value),
            { immediate: true });

        app.use(router);
    },
};

async function ensureRouteLegal(router: Router, location: RouteLocationNormalized) {
    if (!AppContext.isLoaded) {
        return;
    }

    const isAuthenticated = AppContext.user != null;
    const routeInfo = location.meta.info as RouteInfo<any, any> | undefined;

    if (routeInfo == null) {
        return;
    }

    if (!routeInfo.anonymous && !isAuthenticated) {
        await router.push(Routes.Auth.to({ queryParams: { redirectUrl: location.fullPath } }));
        return;
    }

    if (location.name === Routes.Auth.name && isAuthenticated) {
        await router.push(Routes.Storage.to());
        return;
    }
}
