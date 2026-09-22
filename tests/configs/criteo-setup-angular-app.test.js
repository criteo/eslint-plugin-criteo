import { ESLint, Linter } from 'eslint';
import { expect, test } from 'vitest';
import pluginCriteo from '../../lib/index.js';

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: pluginCriteo.configs.criteoSetupAngularApp,
});

test('the Angular app preset is valid for TypeScript files', async () => {
  await expect(eslint.calculateConfigForFile('src/app/app.component.ts')).resolves.toBeDefined();
});

test.each([
  ['app-example', true],
  ['[appExample]', true],
  ['button[appExample]', true],
  ['appExample', false],
  ['[app-example]', false],
])('component selector %s is valid: %s', async (selector, valid) => {
  const config = await eslint.calculateConfigForFile('src/app/app.component.ts');
  const messages = new Linter().verify(
    `@Component({ selector: '${selector}' }) class ExampleComponent {}`,
    {
      files: ['**/*.ts'],
      languageOptions: { parser: config.languageOptions.parser },
      plugins: { '@angular-eslint': config.plugins['@angular-eslint'] },
      rules: { '@angular-eslint/component-selector': config.rules['@angular-eslint/component-selector'] },
    },
    { filename: 'example.component.ts' },
  );

  expect(messages).toEqual(
    valid ? [] : [expect.objectContaining({ ruleId: '@angular-eslint/component-selector', messageId: 'styleFailure' })],
  );
});
