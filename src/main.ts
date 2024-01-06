import "./assets/base.css";

import App from "./App.vue";
import { createApp } from "vue";
import LocalePlugin from "./plugins/localePlugin";
import VuetifyPlugin from "./plugins/vuetifyPlugin";
import RouterPlugin from "./plugins/routerPlugin";
import { RestProtocolFactory } from "@api/base/restProtocolFactory";
import { PassMetaApi } from "@/api";
import { useUserStore } from "@stores/userStore";

RestProtocolFactory.onError = (message: string, more?: string[]) =>
    alert(message + "\n" + more?.join("\n")); // TODO

PassMetaApi.general.getInfo.execute()
    .then(({ user }) => useUserStore().setUser(user));

const app = createApp(App);

app.use(VuetifyPlugin);
app.use(RouterPlugin);
app.use(LocalePlugin);

app.mount("#app");
