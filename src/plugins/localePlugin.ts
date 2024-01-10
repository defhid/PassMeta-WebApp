import type { App } from "vue";
import { createI18n } from "vue-i18n";
import type { RouteLocationRaw } from "vue-router";
import { LocaleHelper } from "~utils/localeHelper";

const SupportedLocales = {
    en: () => import("../locales/en.json"),
    ru: () => import("../locales/ru.json"),
};

const i18n = createI18n({});

export default {
    install(app: App) {
        app.use(i18n);

        app.config.globalProperties.$router.beforeEach(async (to) => {
            const paramsLocale = to.params.locale as string | undefined;

            if (paramsLocale == null) {
                return { path: "/" + LocaleHelper.getUserLocale() + to.path };
            }

            if (!to.name) {
                return;
            }

            if (!(paramsLocale in SupportedLocales)) {
                return {
                    path: to.name,
                    query: to.query,
                    params: { ...to.params, locale: LocaleHelper.getUserLocale() },
                } as RouteLocationRaw;
            }

            if (!i18n.global.availableLocales.includes(paramsLocale)) {
                const loader = SupportedLocales[paramsLocale as keyof typeof SupportedLocales];
                const messages = await loader();

                i18n.global.setLocaleMessage(paramsLocale, messages.default);
            }

            i18n.global.locale = paramsLocale;
            document.querySelector("html")!.setAttribute("lang", paramsLocale);
        });
    },
};

export const t = i18n.global.t;
