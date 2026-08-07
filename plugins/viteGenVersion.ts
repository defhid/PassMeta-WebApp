import { promises as fs } from "fs";
import { resolve } from "path";
import pkg from "../package.json";
import type { PluginOption } from "vite";

export function viteGenVersion(filename: string): PluginOption {
    return {
        name: "Version JSON generation",

        async writeBundle(outputOptions) {
            const path = resolve(__dirname, outputOptions.dir!, filename);
            await fs.writeFile(path, JSON.stringify({ version: pkg.version }));
        },
    };
}
