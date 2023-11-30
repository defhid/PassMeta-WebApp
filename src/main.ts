import "./assets/base.css";

import App from "./App.vue";
import { createApp } from "vue";
import LocalePlugin from "./plugins/localePlugin";
import VuetifyPlugin from "./plugins/vuetifyPlugin";
import RouterPlugin from "./plugins/routerPlugin";

const app = createApp(App);

app.use(VuetifyPlugin);
app.use(RouterPlugin);
app.use(LocalePlugin);

app.mount("#app");
