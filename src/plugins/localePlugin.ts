import { type App, type Plugin } from "vue";
import { i18n, useAppSettings } from "~stores";
import { Routes } from "~routing";

const SupportedLocales = {
    en: () => import("../locales/en.json"),
    ru: () => import("../locales/ru.json"),
};

const LoadedLocales: string[] = [];

const localePlugin: Plugin = (app: App) => {
    app.use(i18n);

    const settings = useAppSettings();
    updateHtmlLocale(settings.locale);

    app.config.globalProperties.$router.beforeEach(async (to) => {
        const paramsLocale = to.params.locale as string | undefined;

        if (paramsLocale == null) {
            return { path: "/" + settings.locale + "/" + to.path.replace(/^[\/\s]+/g, "") };
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

        if (settings.locale !== paramsLocale) {
            settings.locale = paramsLocale;
            updateHtmlLocale(paramsLocale);
        }
    });
};

export default localePlugin;

function updateHtmlLocale(locale: string) {
    document.querySelector("html")!.setAttribute("lang", locale);
}
