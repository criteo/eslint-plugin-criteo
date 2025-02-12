/* eslint-disable n/no-unpublished-import */

import pluginEslint from "@eslint/js";
import pluginEslintPlugin from "eslint-plugin-eslint-plugin";
import pluginNode from "eslint-plugin-n";
import globals from "globals";
import { buildConfig } from "./lib/utils.js";

export default buildConfig(
  [
    pluginEslint.configs.recommended,
    pluginEslintPlugin.configs["flat/recommended"],
    pluginNode.configs["flat/recommended-script"],
  ],
  {
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
  },
);
