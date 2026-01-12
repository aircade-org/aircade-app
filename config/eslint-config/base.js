import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import-x";
import simpleImportSort from "eslint-plugin-simple-import-sort";

/**
 * Base ESLint configuration for the monorepo.
 * Provides TypeScript, Prettier, Turbo, and import sorting rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      turbo: turboPlugin,
      "import-x": importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Turbo
      "turbo/no-undeclared-env-vars": "warn",

      // Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import-x/first": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-duplicates": "error",

      // TypeScript strict rules
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-empty-interface": "off",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "*.config.*"],
  },
];
