import pluginConfigEslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import pluginJs from '@eslint/js';
import pluginRxjs from 'eslint-plugin-rxjs-updated';
import pluginCypress from 'eslint-plugin-cypress';
import pluginTypescript from 'typescript-eslint';
import { buildConfig, tsConfigBase, type ConfigObject, type PluginMap } from '../utils.js';

export const recommended = (plugins: PluginMap): ConfigObject[] =>
  buildConfig([
    pluginJs.configs.recommended,
    pluginTypescript.configs.recommended,
    pluginCypress.configs.recommended,
    pluginConfigEslintComments.recommended,
    pluginRxjs.configs.recommendedTypeChecked,
    {
      ...tsConfigBase,
      name: 'criteo/recommended',
      plugins,
      rules: {
        '@typescript-eslint/no-deprecated': 'error',
        '@typescript-eslint/no-empty-function': 'error',
        'criteo/cypress-no-force': 'error',
        'criteo/filename': 'error',
        'criteo/filename-match-export': ['error', { removeFromFilename: ['.actions'] }],
        'criteo/no-indexed-access-on-enums': 'off',
        'criteo/no-null-undefined-comparison': 'error',
        'criteo/no-spreading-accumulators': 'error',
        'criteo/no-todo-without-ticket': 'error',
        'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
        'eslint-comments/require-description': 'error',
        'no-empty-function': 'off',
        'no-only-tests/no-only-tests': 'error',
        'rxjs/finnish': ['error', { functions: false, methods: false, strict: true }],
        'rxjs/no-unsafe-takeuntil': ['error', { alias: ['untilDestroyed'] }],
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': ['error', { groups: [['^\\u0000', '^@?\\w', '^[^.]', '^\\.']] }],
      },
    },
  ]);
