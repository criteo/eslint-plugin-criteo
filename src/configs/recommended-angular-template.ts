import pluginAngular from 'angular-eslint';
import { buildConfig, type ConfigObject, type PluginMap } from '../utils.js';

export const recommendedAngularTemplate = (plugins: PluginMap): ConfigObject[] =>
  buildConfig([
    pluginAngular.configs.templateRecommended,
    {
      plugins,
      rules: {
        '@angular-eslint/template/alt-text': 'error',
        '@angular-eslint/template/elements-content': 'error',
        '@angular-eslint/template/label-has-associated-control': 'error',
        '@angular-eslint/template/no-duplicate-attributes': 'error',
        '@angular-eslint/template/no-positive-tabindex': 'error',
        '@angular-eslint/template/use-track-by-function': 'error',
        '@angular-eslint/template/valid-aria': 'error',
      },
    },
  ]);
