export class LocaleHelper {
    static getUserLocale() {
        return localStorage.getItem("locale") || this.saveUserLocale(navigator.language);
    }

    static saveUserLocale(locale: string) {
        localStorage.setItem("locale", locale);
        return locale;
    }
}
