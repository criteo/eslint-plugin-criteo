import rule from '../../src/rules/no-null-undefined-comparison.js';
import { untypedRuleTester } from '../rule-tester.js';

untypedRuleTester.run('no-null-undefined-comparison', rule, {
  valid: ['if (foo === 0) {}', 'if (bar != 42) {}', 'if (foo > 0) {}'],
  invalid: [
    { code: 'if (foo === null) {}', errors: [{ messageId: 'default' }] },
    { code: 'if (bar !== undefined) {}', errors: [{ messageId: 'default' }] },
    { code: 'if (foo == null) {}', errors: [{ messageId: 'default' }] },
    { code: 'if (undefined != bar) {}', errors: [{ messageId: 'default' }] },
  ],
});
