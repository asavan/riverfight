import js from "@eslint/js";
import globals from "globals";
import stylistic from '@stylistic/eslint-plugin';

export default [
    {
        ...js.configs.recommended,
        files: ["src/**/*.js", "test/**/*.js"],
        ignores: ["src/js/lib/*"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                __USE_SERVICE_WORKERS__: "readonly",
                __SERVICE_WORKER_VERSION__: "readonly",
                __USE_DEBUG_ASSERT__: "readonly"
            }
        }
    },
    {
        plugins: {
            '@stylistic': stylistic
        },
        files: ["src/**/*.js", "test/**/*.js"],
        ignores: ["src/js/lib/*"],
        rules: {
            "prefer-const": ["error"],
            "require-await": ["error"],
            "no-var": ["error"],
            "prefer-arrow-callback": ["error"],
            "curly": ["error"],
            "keyword-spacing": ["error"],
            "brace-style": ["error", "1tbs"],
            "arrow-body-style": ["error"],
            "space-before-blocks": ["error", "always"],
            "@stylistic/indent": [
                "error",
                4,
                { "SwitchCase": 0 }
            ],
            "@stylistic/linebreak-style": [
                "error",
                "windows"
            ],
            "@stylistic/quotes": [
                "error",
                "double"
            ],
            "@stylistic/semi": [
                "error",
                "always"
            ],
            "@stylistic/no-extra-semi": ["error"],
            "@stylistic/keyword-spacing": ["error"],
            "@stylistic/semi-spacing": ["error"],
            "@stylistic/no-trailing-spaces": ["error"],
            "@stylistic/no-tabs": ["error"],
            "@stylistic/max-len": ["error", {"code": 120}],
            "@stylistic/no-whitespace-before-property": ["error"],
            "@stylistic/no-mixed-spaces-and-tabs": ["error"],
            "@stylistic/comma-spacing": ["error"],
            "@stylistic/no-multi-spaces": ["error"]
        }
    },
    {
        ignores: ["old/*", "android/*", "docs/*", "src/js/lib/*"]
    }
];
