import { type App, type Plugin } from "vue";
import "primeicons/primeicons.css";
import Aura from "@primeuix/themes/aura";
import {
    Config,
    ToastService,
    FocusTrap,
    Tooltip,
    type TooltipOptions,
    Select,
    Checkbox,
    Password,
    FloatLabel,
    InputText,
    Card,
    Button,
    Message,
    InputNumber,
    Menu,
    ProgressSpinner,
    IconField,
    InputIcon,
    Fieldset,
    Listbox,
    Dialog,
} from "primevue";
import { definePreset } from "@primeuix/themes";
import type { PrimeVueConfiguration } from "@primevue/core/config";
import { type LocaleMessage, t } from "~stores";

const DEFAULT_TOOLTIP_DELAY = 500;

const primeVuePlugin: Plugin = (app: App) => {
    const preset = definePreset(Aura, {
        semantic: {
            primary: {
                50: "#5DE991",
                100: "#4BE784",
                200: "#28E26C",
                300: "#1BC559",
                400: "#16A34A",
                500: "#149041",
                600: "#117E39",
                700: "#0F6C31",
                800: "#0C5A29",
                900: "#0A4821",
                950: "#073618",
            },
            colorScheme: {
                dark: {
                    primary: {
                        color: "{primary.400}",
                        contrastColor: "{surface.200}",
                        hoverColor: "{primary.300}",
                        activeColor: "{primary.200}",
                    },
                },
            },
            formField: {
                borderRadius: "{borderRadius.xl}",
            },
            list: {
                option: {
                    borderRadius: "{borderRadius.xl}",
                },
            },
            content: {
                borderRadius: "{borderRadius.xl}",
            },
            navigation: {
                item: {
                    borderRadius: "{borderRadius.xl}",
                },
            },
            overlay: {
                select: {
                    borderRadius: "{borderRadius.xl}",
                },
                popover: {
                    borderRadius: "{borderRadius.xl}",
                },
                modal: {
                    borderRadius: "{borderRadius.xl}",
                },
            },
        },
    });

    const options: PrimeVueConfiguration = {
        theme: {
            preset,
            options: {
                darkModeSelector: "system",
                cssLayer: false,
            },
        },
        ptOptions: {
            tooltip: {
                showDelay: 1000,
            },
        },
    };

    app.use(Config, options);
    app.use(ToastService);

    app.directive("focustrap", FocusTrap);
    app.directive("tooltip", Tooltip);

    app.component("PmButton", Button);
    app.component("PmCard", Card);
    app.component("PmInputText", InputText);
    app.component("PmInputNumber", InputNumber);
    app.component("PmInputPassword", Password);
    app.component("PmInputIcon", InputIcon);
    app.component("PmFloatLabel", FloatLabel);
    app.component("PmCheckbox", Checkbox);
    app.component("PmSelect", Select);
    app.component("PmMessage", Message);
    app.component("PmMenu", Menu);
    app.component("PmProgressSpinner", ProgressSpinner);
    app.component("PmIconField", IconField);
    app.component("PmFieldset", Fieldset);
    app.component("PmListbox", Listbox);
    app.component("PmDialog", Dialog);

    app.config.globalProperties.$tooltip = (optionsOrText: TooltipOptions | LocaleMessage): TooltipOptions => {
        if (typeof (optionsOrText as LocaleMessage) == "string") {
            return { value: t(optionsOrText as LocaleMessage), showDelay: DEFAULT_TOOLTIP_DELAY };
        }

        (optionsOrText as TooltipOptions).showDelay ??= DEFAULT_TOOLTIP_DELAY;
        return optionsOrText as TooltipOptions;
    };
};

export default primeVuePlugin;

declare module "vue" {
    export interface GlobalComponents {
        PmButton: typeof Button;
        PmCard: typeof Card;
        PmInputText: typeof InputText;
        PmInputNumber: typeof InputNumber;
        PmInputIcon: typeof InputIcon;
        PmFloatLabel: typeof FloatLabel;
        PmInputPassword: typeof Password;
        PmCheckbox: typeof Checkbox;
        PmSelect: typeof Select;
        PmMessage: typeof Message;
        PmMenu: typeof Menu;
        PmProgressSpinner: typeof ProgressSpinner;
        PmIconField: typeof IconField;
        PmFieldset: typeof Fieldset;
        PmListbox: typeof Listbox;
        PmDialog: typeof Dialog;
    }

    export interface GlobalDirectives {
        vTooltip: typeof Tooltip;
        vFocustrap: typeof FocusTrap;
    }

    export interface ComponentCustomProperties {
        $tooltip: ((options: TooltipOptions) => TooltipOptions) & ((value: LocaleMessage) => TooltipOptions);
    }
}
