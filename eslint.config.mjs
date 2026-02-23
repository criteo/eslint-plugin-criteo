import pluginEslint from "@eslint/js";
import pluginEslintPlugin from "eslint-plugin-eslint-plugin";
import pluginNode from "eslint-plugin-n";
import { defineConfig } from "eslint/config";

export default defineConfig([
  pluginEslint.configs.recommended,
  pluginEslintPlugin.configs.recommended,
  pluginNode.configs["flat/recommended"],
]);
