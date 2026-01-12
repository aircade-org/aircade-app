import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * ESLint configuration for TypeScript libraries (e.g., Prisma types, shared utilities).
 * Extends base config with Node.js globals and library-specific rules.
 * Ignores generated files (Prisma client, etc.).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const libraryConfig = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    rules: {
      // Libraries should have explicit exports
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Allow index signature for Prisma models
      "@typescript-eslint/consistent-indexed-object-style": "off",

      // Prisma generates complex types
      "@typescript-eslint/no-redundant-type-constituents": "off",
    },
  },
  {
    // Ignore Prisma generated files
    ignores: [
      "generated/**",
      "prisma/generated/**",
      "**/generated/**",
      "dist/**",
      "node_modules/**",
    ],
  },
];
