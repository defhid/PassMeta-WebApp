import "./assets/base.css";

import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import { buildRoutes } from "@routing/routes";

const router = createRouter({
    history: createWebHashHistory(),
    routes: buildRoutes(),
});

const app = createApp(App);
app.use(router);
app.mount("#app");
