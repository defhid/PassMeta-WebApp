import pluginVue from "eslint-plugin-vue";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config({
    extends: [...typescriptEslint.configs.recommended, ...pluginVue.configs["flat/recommended"]],
    files: ["**/*.{ts,vue}"],
    languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parserOptions: {
            parser: typescriptEslint.parser,
        },
    },
    rules: {
        "max-len": ["error", { code: 120 }],
        "no-trailing-spaces": "warn",
        "no-console": ["warn", { allow: ["warn", "error"] }],
        eqeqeq: ["warn", "smart"],
        "comma-dangle": ["warn", "always-multiline"],
        "object-shorthand": "warn",
        "eol-last": "error",

        "vue/block-lang": ["error", { script: { lang: "ts" } }],
        "vue/prop-name-casing": "error",
        "vue/camelcase": "error",
        "vue/attribute-hyphenation": "error",
        "vue/singleline-html-element-content-newline": "off",
        "vue/multi-word-component-names": "off",
        "vue/no-v-text-v-html-on-component": "warn",

        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "warn",
    },
});
