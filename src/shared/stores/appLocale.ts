import { createI18n } from "vue-i18n";
import { useAppSettings } from "~/shared/stores/appSettings";
import { watch } from "vue";
import type { JsonPaths } from "@intlify/core-base";
import type enLocale from "~/locales/en.json";

export type LocaleSchema = typeof enLocale;

const settings = useAppSettings();

export const i18n = createI18n({
    locale: settings.locale,
});

watch(
    () => settings.locale,
    (locale) => (i18n.global.locale = locale),
    { flush: "sync" },
);

export const t: (resource: LocaleMessage) => string = i18n.global.t;

export type LocaleMessage = JsonPaths<LocaleSchema>;
