import rule from '../../lib/rules/no-ngxs-select-decorator.js';
import { untypedRuleTester } from '../rule-tester';
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

untypedRuleTester.run('no-ngxs-select-decorator', rule as RuleModule<string, readonly unknown[]>, {
  valid: [
    {
      code: 'class TestComponent { @ViewSelectSnapshot() value!: string; }',
      filename: 'test.ts',
    },
    {
      // Selector intentionally targets only decorated properties.
      code: 'class TestComponent { @Select() getValue(): string { return ""; } }',
      filename: 'test.ts',
    },
    {
      code: 'class TestComponent { @SelectSnapshot() value!: string; }',
      filename: 'test.ts',
    },
  ],
  invalid: [
    {
      code: 'class TestComponent { @Select() value!: string; }',
      filename: 'test.ts',
      errors: [{ messageId: 'default' }],
    },
    {
      code: 'class TestComponent { @Select(MyState.value) value!: string; }',
      filename: 'test.ts',
      errors: [{ messageId: 'default' }],
    },
    {
      code: 'class TestComponent { @Select value!: string; }',
      filename: 'test.ts',
      errors: [{ messageId: 'default' }],
    },
  ],
});
