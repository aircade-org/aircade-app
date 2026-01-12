import { globalIgnores } from "eslint/config";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import pluginNext from "@next/eslint-plugin-next";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * ESLint configuration for Next.js applications.
 * Extends base config with React, React Hooks, and Next.js rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextJsConfig = [
  ...baseConfig,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
  },
  // React Hooks v7 flat config
  pluginReactHooks.configs.flat.recommended,
  {
    plugins: {
      "@next/next": pluginNext,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // Next.js rules
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,

      // React 19+ JSX transform
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Next.js specific
      "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],
    },
  },
];
