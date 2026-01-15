import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "**/node_modules",
      "**/.next",
      "**/scripts",
      "**/.cache",
      "**/coverage",
      "eslint.config.js",
      "jest.config.js",
      "jest.setup.js",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier,
      perfectionist,
      "@tanstack/query": tanstackQuery,
      react,
      "react-hooks": reactHooks,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "perfectionist/sort-objects": "off",

      "perfectionist/sort-imports": [
        "error",
        {
          internalPattern: ["^@/.+"],
        },
      ],

      "@typescript-eslint/no-explicit-any": "warn",

      "react/jsx-curly-brace-presence": [
        "error",
        {
          props: "never",
          children: "never",
        },
      ],

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
