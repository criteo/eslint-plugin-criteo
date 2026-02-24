import rule from '../../src/rules/filename.js';
import { untypedRuleTester } from '../rule-tester.js';

untypedRuleTester.run('filename', rule, {
  valid: [
    {
      code: 'const value = 1;',
      filename: '/project/foo-bar.ts',
    },
    {
      code: '@Component({ templateUrl: "./foo.component.html" }) class FooComponent {}',
      filename: '/project/foo/foo.component.ts',
    },
    {
      // Empty styleUrls is explicitly ignored by the rule.
      code: '@Component({ styleUrls: [] }) class FooComponent {}',
      filename: '/project/foo/foo.component.ts',
    },
    {
      // Non-literal templateUrl should be ignored instead of crashing.
      code: 'const templatePath = "./foo.component.html"; @Component({ templateUrl: templatePath }) class FooComponent {}',
      filename: '/project/foo/foo.component.ts',
    },
    {
      // Non-literal styleUrl should be ignored instead of crashing.
      code: 'const stylePath = "./foo.component.scss"; @Component({ styleUrl: stylePath }) class FooComponent {}',
      filename: '/project/foo/foo.component.ts',
    },
    {
      // Non-literal styleUrls entries should be ignored instead of crashing.
      code: 'const stylePath = "./foo.component.scss"; @Component({ styleUrls: [stylePath] }) class FooComponent {}',
      filename: '/project/foo/foo.component.ts',
    },
    {
      code: 'const value = 1;',
      filename: '/project/FOO.ts',
      options: [{ pattern: '^[A-Z]+$' }],
    },
  ],
  invalid: [
    {
      code: 'const value = 1;',
      filename: '/project/Foo.ts',
      errors: [{ messageId: 'invalidPattern' }],
    },
    {
      code: '@Component({ templateUrl: "./other.component.html" }) class FooComponent {}',
      filename: '/project/foo/foo.component.ts',
      errors: [{ messageId: 'inconsistent' }],
    },
    {
      code: '@Component({ styleUrl: "./other.component.scss" }) class FooComponent {}',
      filename: '/project/foo/foo.component.ts',
      errors: [{ messageId: 'inconsistent' }],
    },
    {
      code: '@Component({ styleUrls: ["./other.component.scss"] }) class FooComponent {}',
      filename: '/project/foo/foo.component.ts',
      errors: [{ messageId: 'inconsistent' }],
    },
    {
      code: '@Component({}) class FooComponent {}',
      filename: '/project/bar/foo.component.ts',
      errors: [{ messageId: 'componentFolder' }],
    },
  ],
});
