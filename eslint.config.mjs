// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";
import noOnlyPlugin from "eslint-plugin-no-only-tests";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["coverage/*", "index.js", "index.test.mjs", "index.d.ts"],
  },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    rules: {
      semi: "error",
      "prefer-const": "error",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
      },
    },
  },
  // Prevent .only in tests
  {
    plugins: {
      "no-only-tests": noOnlyPlugin,
    },
    rules: { "no-only-tests/no-only-tests": "error" },
  }
);
