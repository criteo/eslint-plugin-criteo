import { createRequire } from 'node:module';
import { buildConfig } from './utils.js';

// External ESlint plugins

import pluginConfigEslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import pluginRxjs from 'eslint-plugin-rxjs-updated';
import pluginRxjsAngular from 'eslint-plugin-rxjs-angular-updated';
import pluginAngular from 'angular-eslint';
import pluginCypress from 'eslint-plugin-cypress/flat';
import pluginNoOnlyTests from 'eslint-plugin-no-only-tests';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginTypescript from 'typescript-eslint';

// Criteo configs

import { criteoSetupAngularApp } from './configs/criteo-setup-angular-app.js';
import { recommendedAngularTemplate } from './configs/recommended-angular-template.js';
import { recommendedAngular } from './configs/recommended-angular.js';
import { recommended } from './configs/recommended.js';

// Criteo rules

const rulesArray = [
  'cypress-no-force',
  'filename',
  'filename-match-export',
  'independent-folders',
  'ngx-component-display',
  'ngx-no-styles-in-component',
  'ngxs-selector-array-length',
  'no-indexed-access-on-enums',
  'no-ngxs-select-decorator',
  'no-null-undefined-comparison',
  'no-spreading-accumulators',
  'no-todo-without-ticket',
  'prefer-readonly-decorators',
  'until-destroy',
];

const rules = {};
for (const rule of rulesArray) {
  rules[rule] = (await import(`./rules/${rule}.js`)).default;
}

// Criteo Plugin

const { name, version } = createRequire(import.meta.url)('../package.json');
const pluginCriteo = { meta: { name, version }, rules };

// Register plugins

// The package does not expose the plugin directly
const pluginConfigEslintCommentsPlugin =
  pluginConfigEslintComments.recommended.plugins['@eslint-community/eslint-comments'];

const plugins = {
  '@angular-eslint': pluginAngular.tsPlugin,
  '@angular-eslint/template': pluginAngular.templatePlugin,
  '@eslint-community/eslint-comments': pluginConfigEslintCommentsPlugin,
  'eslint-comments': pluginConfigEslintCommentsPlugin, // Define with previous alias for backward compatibility
  rxjs: pluginRxjs,
  'rxjs-angular': pluginRxjsAngular,
  '@typescript-eslint': pluginTypescript.plugin,
  'no-only-tests': pluginNoOnlyTests,
  'simple-import-sort': pluginSimpleImportSort,
  criteo: pluginCriteo,
  cypress: pluginCypress,
};

// Register configs

pluginCriteo.configs = {
  criteoSetupAngularApp: criteoSetupAngularApp(plugins),
  recommended: recommended(plugins),
  recommendedAngular: recommendedAngular(plugins),
  recommendedAngularApp: recommendedAngular(plugins), // For future usage
  recommendedAngularLib: recommendedAngular(plugins), // For future usage
  recommendedAngularTemplate: recommendedAngularTemplate(plugins),
};

// Exports

export default pluginCriteo;
export { buildConfig };
