import { type App, type Plugin } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const vuetifyPlugin: Plugin = (app: App) => {
    const vuetify = createVuetify({
        components,
        directives,
        icons: {
            defaultSet: "mdi",
            aliases,
            sets: { mdi },
        },
        theme: {
            defaultTheme: "passMetaTheme",
            themes: {
                passMetaTheme: {
                    dark: true,
                    colors: {
                        primary: "#388E3C",
                        secondary: "#424242",
                    },
                },
            },
        },
    });

    app.use(vuetify);
};

export default vuetifyPlugin;
