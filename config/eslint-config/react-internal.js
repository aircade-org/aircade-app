import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * ESLint configuration for internal React libraries/packages.
 * Extends base config with React and React Hooks rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const reactInternalConfig = [
  ...baseConfig,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
  },
  // React Hooks v7 flat config
  pluginReactHooks.configs.flat.recommended,
  {
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React 19+ JSX transform
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Library-specific: allow default exports for components
      "import-x/no-default-export": "off",
    },
  },
];
