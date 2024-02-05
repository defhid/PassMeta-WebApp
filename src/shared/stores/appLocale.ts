import { createI18n } from "vue-i18n";

export function getAppLocale() {
    return localStorage.getItem("locale") || saveAppLocale(navigator.language);
}

export function saveAppLocale(locale: string) {
    localStorage.setItem("locale", locale);
    return locale;
}

export const i18n = createI18n({
    locale: getAppLocale(),
});

export const t = i18n.global.t;
