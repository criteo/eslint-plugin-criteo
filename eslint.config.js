import pluginEslint from '@eslint/js';
import pluginEslintPlugin from 'eslint-plugin-eslint-plugin';
import pluginNode from 'eslint-plugin-n';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import vitest from '@vitest/eslint-plugin';

export default defineConfig([
  globalIgnores(['lib']),
  pluginEslint.configs.recommended,
  pluginEslintPlugin.configs.recommended,
  pluginNode.configs['flat/recommended'],
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js', 'vitest.config.ts'],
        },
      },
    },
  },
  {
    files: ['tests/**'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
]);
