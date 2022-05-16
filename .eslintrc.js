module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
  },
  env: {
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:jest/recommended"],
  rules: {
    "jest/expect-expect": "off",
  },
  overrides: [
    {
      files: "*.mjs",
      parserOptions: {
        sourceType: "module",
      },
    },
  ],
};
