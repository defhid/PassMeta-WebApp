import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = import.meta.url;

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "~": fileURLToPath(new URL("./src", baseUrl)),
            "~api": fileURLToPath(new URL("./src/shared/api", baseUrl)),
            "~assets": fileURLToPath(new URL("./src/shared/assets", baseUrl)),
            "~entities": fileURLToPath(new URL("./src/entities", baseUrl)),
            "~features": fileURLToPath(new URL("./src/features", baseUrl)),
            "~generated": fileURLToPath(new URL("./src/shared/.generated", baseUrl)),
            "~infra": fileURLToPath(new URL("./src/infrastructure", baseUrl)),
            "~pages": fileURLToPath(new URL("./src/pages", baseUrl)),
            "~plugins": fileURLToPath(new URL("./src/plugins", baseUrl)),
            "~routing": fileURLToPath(new URL("./src/shared/routing", baseUrl)),
            "~stores": fileURLToPath(new URL("./src/shared/stores", baseUrl)),
            "~shared": fileURLToPath(new URL("./src/shared", baseUrl)),
            "~utils": fileURLToPath(new URL("./src/shared/utils", baseUrl)),
            "~widgets": fileURLToPath(new URL("./src/widgets", baseUrl)),
        },
    },
    server: {
        proxy: {
            "/api": {
                target: process.env.VITE_PASSMETA_API,
                changeOrigin: true,
            },
        },
    },
});
