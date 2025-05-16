import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  eslintPluginPrettierRecommended,
  eslint.configs.recommended,
  tseslint.configs.recommended,
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
  },
);
