import { createI18n } from "vue-i18n";
import { useAppSettings } from "~/shared/stores/appSettings";
import { watch } from "vue";

const settings = useAppSettings();

export const i18n = createI18n({
    locale: settings.locale,
});

watch(
    () => settings.locale,
    (locale) => (i18n.global.locale = locale),
    { flush: "sync" },
);

export const t = i18n.global.t;
