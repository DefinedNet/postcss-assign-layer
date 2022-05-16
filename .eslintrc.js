module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
  },
  env: {
    node: true,
    es6: true,
  },
  plugins: ["no-only-tests"],
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: "*.mjs",
      parserOptions: {
        sourceType: "module",
      },
    },
    // Prevent .only in tests
    {
      files: ["src/**/*.test.{ts,tsx}"],
      rules: { "no-only-tests/no-only-tests": "error" },
    },
  ],
};
