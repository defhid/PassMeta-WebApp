import type { App, Plugin } from "vue";
import { getAppLocale, i18n, saveAppLocale } from "~stores";
import { Routes } from "~routing";

const SupportedLocales = {
    en: () => import("../locales/en.json"),
    ru: () => import("../locales/ru.json"),
};

const LoadedLocales: string[] = [];

const localePlugin: Plugin = (app: App) => {
    app.use(i18n);

    app.config.globalProperties.$router.beforeEach(async (to) => {
        const paramsLocale = to.params.locale as string | undefined;
        const currentLocale = getAppLocale();

        if (paramsLocale == null) {
            return { path: "/" + currentLocale + to.path };
        }

        if (!to.name) {
            return;
        }

        if (!(paramsLocale in SupportedLocales)) {
            return Routes.NotFound.to();
        }

        if (!LoadedLocales.includes(paramsLocale)) {
            const loader = SupportedLocales[paramsLocale as keyof typeof SupportedLocales];
            const messages = await loader();

            i18n.global.setLocaleMessage(paramsLocale, messages.default);
            LoadedLocales.push(paramsLocale);
        }

        if (currentLocale !== paramsLocale) {
            i18n.global.locale = paramsLocale;
            saveAppLocale(paramsLocale);
        }

        document.querySelector("html")!.setAttribute("lang", paramsLocale);
    });
};

export default localePlugin;
