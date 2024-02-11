module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:perfectionist/recommended-natural",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: true,
  },
  plugins: ["@typescript-eslint", "perfectionist", "sonarjs", "unicorn"],
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-imports": "error",
    // Avoid changing tsconfig.json "lib" from es2015 to es2021
    "unicorn/prefer-string-replace-all": "off",
  },
};
