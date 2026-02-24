import { buildConfig, type ConfigObject, type PluginMap } from '../utils.js';
import { recommendedAngular } from './recommended-angular.js';
import { recommendedAngularTemplate } from './recommended-angular-template.js';

export const criteoSetupAngularApp = (plugins: PluginMap): ConfigObject[] =>
  buildConfig([
    {
      ignores: ['.angular', '.vscode', 'dist', 'coverage', 'build', '**/*.generated.ts'],
    },
    buildConfig(recommendedAngular(plugins), { files: ['**/*.ts'] }),
    {
      files: ['**/*.ts'],
      rules: {
        '@angular-eslint/component-max-inline-declarations': ['error', { animations: 5, styles: 3, template: 10 }],
        '@angular-eslint/component-selector': ['error', { style: 'kebab-case' }],
        '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
        '@angular-eslint/no-forward-ref': 'error',
        '@angular-eslint/no-queries-metadata-property': 'error',
        '@angular-eslint/prefer-output-readonly': 'error',
        '@angular-eslint/prefer-standalone': 'error',
        '@angular-eslint/use-lifecycle-interface': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid',
            filter: {
              regex: '^\\d+$|^_$',
              match: false,
            },
          },

          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid',
          },
          {
            selector: 'objectLiteralProperty',
            format: ['camelCase', 'snake_case'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid',
            filter: {
              regex: '^\\d+$',
              match: false,
            },
          },
          {
            selector: 'classProperty',
            format: ['camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'forbid',
          },
          {
            selector: 'classProperty',
            modifiers: ['static'],
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          },
          {
            selector: 'classProperty',
            filter: {
              regex: 'Enum$',
              match: true,
            },
            format: ['PascalCase'],
          },
          {
            selector: 'typeProperty',
            format: ['camelCase', 'snake_case'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'forbid',
          },
          {
            selector: 'enumMember',
            format: ['PascalCase', 'UPPER_CASE'],
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'interface',
            format: ['PascalCase'],
          },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        'criteo/independent-folders': [
          'error',
          {
            basePath: './src/app/',
            featureFolders: ['core', 'example'],
            sharedFolders: ['shared'],
          },
        ],
        curly: 'error',
        eqeqeq: ['error', 'always'],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'no-console': 'error',
        'no-implicit-coercion': 'error',
        'prefer-template': 'error',
        'spaced-comment': 'error',
      },
    },
    {
      files: ['**/*.actions.ts'],
      rules: {
        '@typescript-eslint/no-namespace': 'off',
      },
    },
    {
      files: ['**/*.mock.ts'],
      rules: {
        '@angular-eslint/component-class-suffix': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'criteo/filename': 'off',
      },
    },
    {
      files: [
        '**/*.model.ts',
        '**/*.pipe.ts',
        '**/*.utils.ts',
        '**/*.mock.ts',
        '**/*.config.ts',
        'environments/environment.*.ts',
        'cypress/mocks/**/*client.ts',
      ],
      rules: {
        'criteo/filename-match-export': 'off',
      },
    },
    {
      files: ['cypress/mocks/**/*.ts', 'cypress/fixtures/**/*.ts'],
      rules: {
        'max-len': [
          'error',
          {
            ignoreStrings: true,
          },
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: ['objectLiteralProperty'],
            format: null,
          },
        ],
      },
    },
    {
      files: ['cypress/plugins/**/*.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['src/environments/**/*.ts'],
      rules: {
        '@typescript-eslint/naming-convention': 'off',
        'criteo/filename-match-export': 'off',
        'criteo/no-todo-without-ticket': 'off',
      },
    },
    buildConfig(recommendedAngularTemplate(plugins), { files: ['**/*.html'] }),
    {
      files: ['**/*.html'],
      rules: {
        '@angular-eslint/template/prefer-control-flow': 'error',
        '@angular-eslint/template/prefer-self-closing-tags': 'error',
      },
    },
  ]);
