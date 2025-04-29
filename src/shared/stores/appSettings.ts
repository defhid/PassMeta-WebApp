import { createGlobalState } from "@vueuse/shared";
import { reactive, watch } from "vue";

/**
 * Application local settings.
 */
export interface AppSettings {
    /**
     * Application language.
     */
    locale: string;

    /**
     * Hide user passwords.
     */
    hidePasswords: boolean;
}

/**
 * Use application local settings.
 */
export const useAppSettings = createGlobalState(() => {
    function loadAppSettings(): AppSettings {
        const str = localStorage.getItem(localStorageKey) ?? "{}";
        try {
            const obj = JSON.parse(str);
            return {
                locale: (obj.locale ?? navigator.language.split("-")[0]) || defaultLocale,
                hidePasswords: obj.hidePasswords == null ? defaultHidePasswords : Boolean(obj.hidePasswords),
            };
        } catch {
            return { locale: defaultLocale, hidePasswords: defaultHidePasswords };
        }
    }

    const settings = reactive(loadAppSettings());

    watch(settings, () => localStorage.setItem(localStorageKey, JSON.stringify(settings)));

    return settings;
});

const localStorageKey = "settings";
const defaultLocale = "en";
const defaultHidePasswords = true;
