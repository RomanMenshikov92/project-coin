import js from "@eslint/js";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "backend/**"],
    files: ["**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        globals: {
          setTimeout: true,
          document: true,
          window: true,
          console: true,
        },
        env: {
          browser: true,
          node: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      camelcase: "warn",
      indent: ["warn", 2],
      "func-style": ["warn", "declaration"],
      "array-callback-return": ["warn", { allowImplicit: true }],
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
];
