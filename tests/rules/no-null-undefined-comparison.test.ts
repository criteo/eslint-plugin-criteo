import rule from '../../lib/rules/no-null-undefined-comparison.js';
import { untypedRuleTester } from '../rule-tester';
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

untypedRuleTester.run('no-null-undefined-comparison', rule as RuleModule<string, readonly unknown[]>, {
  valid: ['if (foo === 0) {}', 'if (bar != 42) {}', 'if (foo > 0) {}'],
  invalid: [
    { code: 'if (foo === null) {}', errors: [{ messageId: 'default' }] },
    { code: 'if (bar !== undefined) {}', errors: [{ messageId: 'default' }] },
    { code: 'if (foo == null) {}', errors: [{ messageId: 'default' }] },
    { code: 'if (undefined != bar) {}', errors: [{ messageId: 'default' }] },
  ],
});
