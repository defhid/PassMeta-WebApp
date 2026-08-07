import pluginVue from "eslint-plugin-vue";
import typescriptEslint from "typescript-eslint";
import pluginUnusedImports from "eslint-plugin-unused-imports";

export default typescriptEslint.config(
    {
        ignores: ["./node_modules/**/*", "dist/**/*", "dev-dist/**/*"],
    },
    {
        extends: [...typescriptEslint.configs.recommended, ...pluginVue.configs["flat/recommended"]],
        files: ["**/*.{ts,vue}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                parser: typescriptEslint.parser,
            },
        },
        plugins: {
            "unused-imports": pluginUnusedImports,
        },
        rules: {
            "max-len": ["error", { code: 120 }],
            "no-trailing-spaces": "warn",
            "no-console": "off",
            eqeqeq: ["warn", "smart"],
            "comma-dangle": ["warn", "always-multiline"],
            "object-shorthand": "warn",
            "eol-last": "error",

            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": ["warn", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],

            "vue/block-lang": ["error", { script: { lang: "ts" } }],
            "vue/prop-name-casing": "error",
            "vue/camelcase": "error",
            "vue/attribute-hyphenation": "error",
            "vue/singleline-html-element-content-newline": "off",
            "vue/multi-word-component-names": "off",
            "vue/no-v-text-v-html-on-component": "warn",
            "vue/max-attributes-per-line": "off",
            "vue/html-self-closing": ["error", { html: { void: "always", normal: "always", component: "always" } }],
            "vue/html-indent": "off",
            "vue/no-mutating-props": ["error", { shallowOnly: true }],

            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-unused-expressions": "off",
        },
    },
);
