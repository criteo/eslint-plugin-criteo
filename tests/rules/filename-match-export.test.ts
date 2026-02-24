import rule from '../../src/rules/filename-match-export.js';
import { untypedRuleTester } from '../rule-tester.js';

untypedRuleTester.run('filename-match-export', rule, {
  valid: [
    { code: 'export const foo = 1;', filename: '/project/foo.ts' },
    { code: 'export class FooBar {}', filename: '/project/foo-bar.ts' },
    {
      code: 'export const foo = 1;',
      filename: '/project/foo.service.ts',
      options: [{ removeFromFilename: ['.service'] }],
    },
    {
      code: 'const foo = 1; export { foo as Bar };',
      filename: '/project/bar.ts',
    },
    {
      // Destructured exports don't expose a named identifier and should be ignored.
      code: 'const source = { foo: 1 }; export const { foo } = source;',
      filename: '/project/anything.ts',
    },
    { code: 'const x = 1;', filename: '/project/anything.ts' },
  ],
  invalid: [
    {
      code: 'export const foo = 1;',
      filename: '/project/bar.ts',
      errors: [{ messageId: 'error' }],
    },
    {
      code: 'export const foo = 1; export const bar = 2;',
      filename: '/project/baz.ts',
      errors: [{ messageId: 'error' }],
    },
  ],
});
