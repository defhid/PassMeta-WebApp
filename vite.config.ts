import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const baseUrl = import.meta.url;

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", baseUrl)),
            "@assets": fileURLToPath(new URL("./src/assets", baseUrl)),
            "@models": fileURLToPath(new URL("./src/models", baseUrl)),
            "@pages": fileURLToPath(new URL("./src/pages", baseUrl)),
            "@routing": fileURLToPath(new URL("./src/routing", baseUrl)),
            "@stores": fileURLToPath(new URL("./src/stores", baseUrl)),
            "@utils": fileURLToPath(new URL("./src/utils", baseUrl)),
        },
    },
});
