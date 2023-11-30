import type { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { buildRoutes } from "@routing/routes";

export default {
    install(app: App) {
        const router = createRouter({
            history: createWebHistory(),
            routes: buildRoutes(),
        });

        app.use(router);
    },
};
