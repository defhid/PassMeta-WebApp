import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const baseUrl = import.meta.url;

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", baseUrl)),
            "@pages": fileURLToPath(new URL("./src/pages", baseUrl)),
            "@utils": fileURLToPath(new URL("./src/utils", baseUrl)),
            "@routing": fileURLToPath(new URL("./src/routing", baseUrl)),
        },
    },
});
