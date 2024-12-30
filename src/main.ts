import "~assets/base.css";

import App from "./App.vue";
import { createApp } from "vue";
import LocalePlugin from "./plugins/localePlugin";
import VuetifyPlugin from "./plugins/vuetifyPlugin";
import RouterPlugin from "./plugins/routerPlugin";
import { RestProtocolFactory } from "~api/base/restProtocolFactory";
import { AppContext } from "~stores";
import { Notify } from "~utils";

RestProtocolFactory.onError = (message: string, more?: string[]) => Notify.error(message + "\n" + more?.join("\n"));

AppContext.load().then();

const app = createApp(App);

app.use(VuetifyPlugin);
app.use(RouterPlugin);
app.use(LocalePlugin);

app.mount("#app");
