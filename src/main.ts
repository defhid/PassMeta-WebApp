import "~assets/base.css";
import App from "./App.vue";
import { createApp } from "vue";
import localePlugin from "./plugins/localePlugin";
import routerPlugin from "./plugins/routerPlugin";
import { RestProtocolFactory } from "~api/base/restProtocolFactory";
import { useAppContext } from "~stores";
import { Notify } from "~utils";
import { GeneralApi } from "~entities/backend";
import primeVuePlugin from "~plugins/primeVuePlugin";

RestProtocolFactory.onError = (message: string, more?: string[]) => Notify.failure(message + "\n" + more?.join("\n"));

useAppContext().load(GeneralApi.getInfo).then();

const app = createApp(App);

app.use(primeVuePlugin);
app.use(routerPlugin);
app.use(localePlugin);

app.mount("#app");
