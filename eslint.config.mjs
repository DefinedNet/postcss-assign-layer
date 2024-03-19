import noOnlyPlugin from "eslint-plugin-no-only-tests";
import eslint from "@eslint/js";

export default [
  eslint.configs.recommended,
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
  },
];
