import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // Disable some overly strict rules for our use case
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",

      // Encourage good practices
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    files: ["tests/**/*", "examples/**/*"],
    rules: {
      // More relaxed rules for tests and examples
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "off",
    },
  },
  {
    files: ["benchmarks/**/*"],
    rules: {
      // More relaxed rules for benchmarks
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off", // Allow benchmark expressions
      "no-console": "off",
      "no-loss-of-precision": "off", // Allow large numbers in performance benchmarks
    },
  },
  {
    ignores: [
      "dist/**",
      "typings/**",
      "node_modules/**",
      "*.js",
      "*.mjs",
      "*.cjs",
    ],
  },
];
