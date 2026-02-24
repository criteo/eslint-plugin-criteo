import { createRequire } from 'node:module';
import pluginConfigEslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import pluginAngular from 'angular-eslint';
import pluginCypress from 'eslint-plugin-cypress';
import pluginNoOnlyTests from 'eslint-plugin-no-only-tests';
import pluginRxjsAngular from 'eslint-plugin-rxjs-angular-updated';
import pluginRxjs from 'eslint-plugin-rxjs-updated';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginTypescript from 'typescript-eslint';
import { criteoSetupAngularApp } from './configs/criteo-setup-angular-app.js';
import { recommendedAngularTemplate } from './configs/recommended-angular-template.js';
import { recommendedAngular } from './configs/recommended-angular.js';
import { recommended } from './configs/recommended.js';
import cypressNoForce from './rules/cypress-no-force.js';
import filenameMatchExport from './rules/filename-match-export.js';
import filename from './rules/filename.js';
import independentFolders from './rules/independent-folders.js';
import ngxComponentDisplay from './rules/ngx-component-display.js';
import ngxNoStylesInComponent from './rules/ngx-no-styles-in-component.js';
import ngxsSelectorArrayLength from './rules/ngxs-selector-array-length.js';
import noIndexedAccessOnEnums from './rules/no-indexed-access-on-enums.js';
import noNgxsSelectDecorator from './rules/no-ngxs-select-decorator.js';
import noNullUndefinedComparison from './rules/no-null-undefined-comparison.js';
import noSpreadingAccumulators from './rules/no-spreading-accumulators.js';
import noTodoWithoutTicket from './rules/no-todo-without-ticket.js';
import preferReadonlyDecorators from './rules/prefer-readonly-decorators.js';
import untilDestroy from './rules/until-destroy.js';
import { buildConfig, type ConfigObject, type PluginMap } from './utils.js';

const rules = {
  'cypress-no-force': cypressNoForce,
  filename,
  'filename-match-export': filenameMatchExport,
  'independent-folders': independentFolders,
  'ngx-component-display': ngxComponentDisplay,
  'ngx-no-styles-in-component': ngxNoStylesInComponent,
  'ngxs-selector-array-length': ngxsSelectorArrayLength,
  'no-indexed-access-on-enums': noIndexedAccessOnEnums,
  'no-ngxs-select-decorator': noNgxsSelectDecorator,
  'no-null-undefined-comparison': noNullUndefinedComparison,
  'no-spreading-accumulators': noSpreadingAccumulators,
  'no-todo-without-ticket': noTodoWithoutTicket,
  'prefer-readonly-decorators': preferReadonlyDecorators,
  'until-destroy': untilDestroy,
};

type CriteoPlugin = {
  meta: {
    name: string;
    version: string;
  };
  rules: typeof rules;
  configs: Record<string, ConfigObject[]>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readPackageMetadata(): { name: string; version: string } {
  const packageJson: unknown = createRequire(import.meta.url)('../package.json');

  if (!isRecord(packageJson)) {
    throw new Error('Could not read package metadata.');
  }

  const packageName = packageJson['name'];
  const packageVersion = packageJson['version'];

  if (typeof packageName !== 'string' || typeof packageVersion !== 'string') {
    throw new Error('Package metadata is missing name or version.');
  }

  return { name: packageName, version: packageVersion };
}

const { name, version } = readPackageMetadata();
const pluginCriteo: CriteoPlugin = {
  meta: { name, version },
  rules,
  configs: {},
};

const pluginConfigEslintCommentsPlugin =
  pluginConfigEslintComments.recommended.plugins?.['@eslint-community/eslint-comments'] ?? {};

const plugins: PluginMap = {
  '@angular-eslint': pluginAngular.tsPlugin,
  '@angular-eslint/template': pluginAngular.templatePlugin,
  '@eslint-community/eslint-comments': pluginConfigEslintCommentsPlugin,
  'eslint-comments': pluginConfigEslintCommentsPlugin,
  rxjs: pluginRxjs,
  'rxjs-angular': pluginRxjsAngular,
  '@typescript-eslint': pluginTypescript.plugin,
  'no-only-tests': pluginNoOnlyTests,
  'simple-import-sort': pluginSimpleImportSort,
  criteo: pluginCriteo,
  cypress: pluginCypress,
};

pluginCriteo.configs = {
  criteoSetupAngularApp: criteoSetupAngularApp(plugins),
  recommended: recommended(plugins),
  recommendedAngular: recommendedAngular(plugins),
  recommendedAngularApp: recommendedAngular(plugins),
  recommendedAngularLib: recommendedAngular(plugins),
  recommendedAngularTemplate: recommendedAngularTemplate(plugins),
};

export default pluginCriteo;
export { buildConfig };
