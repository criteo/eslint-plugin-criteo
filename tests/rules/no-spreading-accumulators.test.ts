import rule from '../../lib/rules/no-spreading-accumulators.js';
import { untypedRuleTester } from '../rule-tester';
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

untypedRuleTester.run('no-spreading-accumulators', rule as RuleModule<string, readonly unknown[]>, {
  valid: [
    {
      code: 'const result = items.reduce((acc, item) => { acc[item.id] = item; return acc; }, {});',
    },
    {
      code: 'const result = items.reduce((acc, item) => ({ [item.id]: item }), {});',
    },
  ],
  invalid: [
    {
      code: 'const result = items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});',
      errors: [{ messageId: 'objectMessage' }],
      output: 'const result = items.reduce((acc, item) => { acc[item.id] = item; return acc; }, {});',
    },
    {
      code: 'const result = items.reduce((acc, item) => [...acc, item], []);',
      errors: [{ messageId: 'arrayMessage' }],
      output: 'const result = items.reduce((acc, item) => { acc.push(item); return acc; }, []);',
    },
    {
      // Spread is not first, so rule should report without autofix.
      code: 'const result = items.reduce((acc, item) => ({ [item.id]: item, ...acc }), {});',
      errors: [{ messageId: 'objectMessage' }],
      output: null,
    },
    {
      // Mixed spreads are reported but intentionally not auto-fixed.
      code: 'const result = items.reduce((acc, item) => ({ ...acc, ...item }), {});',
      errors: [{ messageId: 'objectMessage' }],
      output: null,
    },
    {
      // One-param reducer should report, but should not auto-fix.
      code: 'const result = items.reduce((acc) => ({ ...acc, static: true }), {});',
      errors: [{ messageId: 'objectMessage' }],
      output: null,
    },
    {
      // Array spread not first should report without autofix.
      code: 'const result = items.reduce((acc, item) => [item, ...acc], []);',
      errors: [{ messageId: 'arrayMessage' }],
      output: null,
    },
  ],
});
