import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const baseUrl = import.meta.url;

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "~": fileURLToPath(new URL("./src", baseUrl)),
            "~api": fileURLToPath(new URL("./src/api", baseUrl)),
            "~assets": fileURLToPath(new URL("./src/assets", baseUrl)),
            "~enums": fileURLToPath(new URL("./src/enums", baseUrl)),
            "~generated": fileURLToPath(new URL("./src/.generated", baseUrl)),
            "~models": fileURLToPath(new URL("./src/models", baseUrl)),
            "~pages": fileURLToPath(new URL("./src/pages", baseUrl)),
            "~plugins": fileURLToPath(new URL("./src/plugins", baseUrl)),
            "~routing": fileURLToPath(new URL("./src/routing", baseUrl)),
            "~stores": fileURLToPath(new URL("./src/stores", baseUrl)),
            "~utils": fileURLToPath(new URL("./src/utils", baseUrl)),
        },
    },
});
