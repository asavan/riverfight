import js from "@eslint/js";
import globals from "globals";
import stylisticJs from '@stylistic/eslint-plugin-js';

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
            '@stylistic/js': stylisticJs
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
            "@stylistic/js/indent": [
                "error",
                4
            ],
            "@stylistic/js/linebreak-style": [
                "error",
                "windows"
            ],
            "@stylistic/js/quotes": [
                "error",
                "double"
            ],
            "@stylistic/js/semi": [
                "error",
                "always"
            ],
            "@stylistic/js/no-extra-semi": ["error"],
            "@stylistic/js/keyword-spacing": ["error"],
            "@stylistic/js/semi-spacing": ["error"],
            "@stylistic/js/no-trailing-spaces": ["error"],
            "@stylistic/js/no-tabs": ["error"],
            "@stylistic/js/max-len": ["error", {"code": 120}],
            "@stylistic/js/no-whitespace-before-property": ["error"],
            "@stylistic/js/no-mixed-spaces-and-tabs": ["error"],
            "@stylistic/js/comma-spacing": ["error"],
            "@stylistic/js/no-multi-spaces": ["error"]
        }
    },
    {
        ignores: ["old/*", "android/*", "docs/*", "src/js/lib/*"]
    }
];
