import type { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { buildRoutes } from "@routing/routes";
import { useUserStore } from "@stores/userStore";

export default {
    install(app: App) {
        const router = createRouter({
            history: createWebHistory(),
            routes: buildRoutes(),
        });

        router.beforeEach((to) => {
            if (to.name === "Auth" && useUserStore().isAuthenticated) {
                return { name: "Storage" };
            }
        });

        app.use(router);
    },
};
