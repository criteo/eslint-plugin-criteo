import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll } from 'vitest';

RuleTester.afterAll = afterAll;

export const untypedRuleTester = new RuleTester();

export const typedRuleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts'],
      },
    },
  },
});
