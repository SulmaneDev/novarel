import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], rules: {
    ...js.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    "no-var": "error",
    "prefer-const": "error",
    "no-unused-vars": "error",
    "no-console": "warn",
    "no-debugger": "warn",
    "eqeqeq": ["error", "always"],
    "curly": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
  } },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  tseslint.configs.recommended,

]);
