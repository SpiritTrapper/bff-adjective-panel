import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "lines-between-class-members": [
        "error",
        "always",
        {
          exceptAfterSingleLine: false,
        },
      ],
      "no-throw-literal": "error",
      "prettier/prettier": [
        "error",
        {
          usePrettierrc: true,
        },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
      "import/no-extraneous-dependencies": "error",
      "@typescript-eslint/naming-convention": 0,
      "@typescript-eslint/ban-ts-comments": 0,
      "@typescript-eslint/return-await": 0,
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/lines-between-class-members": 0,
      "@typescript-eslint/no-throw-literal": 0,
      "react/react-in-jsx-scope": 0,
      "react-refresh/only-export-components": 0,
      "import/no-named-as-default": 0,
      "react/prop-types": 0,
      "no-useless-escape": 0,
      "react-form-fields/no-mix-controlled-with-uncontrolled": 0,
      "react-form-fields/no-only-value-prop": 0,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
  },
]);
