import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";

export default tseslint.config(
  eslintPluginPrettierRecommended,
  eslint.configs.recommended,
  tseslint.configs.recommended,
  jsdoc.configs["flat/recommended-typescript-error"],
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
    languageOptions: {
      globals: {
        global: "readonly",
        Class: "readonly",
        action: "writable",
        current: "writable",
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
    },
  },
);
