import "~assets/base.css";

import App from "./App.vue";
import { createApp } from "vue";
import LocalePlugin from "./plugins/localePlugin";
import VuetifyPlugin from "./plugins/vuetifyPlugin";
import routerPlugin from "./plugins/routerPlugin";
import { RestProtocolFactory } from "~api/base/restProtocolFactory";
import { useAppContext } from "~stores";
import { Notify } from "~utils";

RestProtocolFactory.onError = (message: string, more?: string[]) => Notify.error(message + "\n" + more?.join("\n"));

useAppContext().load().then();

const app = createApp(App);

app.use(VuetifyPlugin);
app.use(routerPlugin);
app.use(LocalePlugin);

app.mount("#app");
