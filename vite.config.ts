import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type UserConfigFnObject } from "vite";
import vue from "@vitejs/plugin-vue";
import dotenv from "dotenv";
import basicSsl from "@vitejs/plugin-basic-ssl";
import process from "node:process";

dotenv.config({ path: ["./.env.local", "./.env"] });

const config: UserConfigFnObject = ({ mode }) => {
    const baseUrl = import.meta.url;
    const env = loadEnv(mode, process.cwd());

    return defineConfig({
        plugins: [
            vue(),
            env.VITE_LOCAL_SSL === "true"
                ? basicSsl({
                      name: "local-cert",
                      domains: ["localhost"],
                  })
                : undefined,
        ],
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
                "~routing": fileURLToPath(new URL("./src/pages/routing", baseUrl)),
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
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
        define: {
            APP_VERSION: JSON.stringify(process.env.APP_VERSION || process.env.npm_package_version),
        },
    });
};

export default config;
