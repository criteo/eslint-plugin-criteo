import rule from '../../lib/rules/prefer-readonly-decorators.js';
import { untypedRuleTester } from '../rule-tester';
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

untypedRuleTester.run('prefer-readonly-decorators', rule as RuleModule<string, readonly unknown[]>, {
  valid: [
    {
      // Rule does nothing without explicit decorators option.
      code: 'class TestComponent { @Output() value = new EventEmitter<string>(); }',
    },
    {
      code: 'class TestComponent { @Output() readonly value = new EventEmitter<string>(); }',
      options: [{ decorators: ['Output'] }],
    },
    {
      code: 'class TestComponent { @Input() value = ""; }',
      options: [{ decorators: ['Output'] }],
    },
    {
      // Non-call decorator syntax should be handled safely.
      code: 'class TestComponent { @Output readonly value = new EventEmitter<string>(); }',
      options: [{ decorators: ['Output'] }],
    },
  ],
  invalid: [
    {
      code: 'class TestComponent { @Output() value = new EventEmitter<string>(); }',
      options: [{ decorators: ['Output'] }],
      errors: [{ messageId: 'default' }],
    },
    {
      code: 'class TestComponent { @ViewSelectSnapshot selected = 1; }',
      options: [{ decorators: ['ViewSelectSnapshot'] }],
      errors: [{ messageId: 'default' }],
    },
  ],
});
