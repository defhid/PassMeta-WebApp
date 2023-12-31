import { type App } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

export default {
    install(app: App) {
        const vuetify = createVuetify({
            components,
            directives,
            icons: {
                defaultSet: "mdi",
                aliases,
                sets: { mdi },
            },
            theme: {
                defaultTheme: "dark",
            },
        });

        app.use(vuetify);
    },
};
