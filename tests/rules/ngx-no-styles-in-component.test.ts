import rule from '../../src/rules/ngx-no-styles-in-component.js';
import { untypedRuleTester } from '../rule-tester.js';

untypedRuleTester.run('ngx-no-styles-in-component', rule, {
  valid: [
    {
      code: '@Component({ templateUrl: "./foo.component.html" }) class FooComponent {}',
    },
    {
      code: 'const config = { styles: [".a {}"] };',
    },
  ],
  invalid: [
    {
      code: '@Component({ styles: [".a {}"] }) class FooComponent {}',
      errors: [{ messageId: 'styles' }],
    },
    {
      code: '@Component({ styleUrl: "./foo.component.scss" }) class FooComponent {}',
      errors: [{ messageId: 'styles' }],
    },
    {
      code: '@Component({ styleUrls: ["./foo.component.scss"] }) class FooComponent {}',
      errors: [{ messageId: 'styles' }],
    },
    {
      // String-literal keys are also matched by the selector.
      code: '@Component({ "styles": [".a {}"] }) class FooComponent {}',
      errors: [{ messageId: 'styles' }],
    },
    {
      // Template-literal keys are also matched by the selector.
      code: '@Component({ [`styles`]: [".a {}"] }) class FooComponent {}',
      errors: [{ messageId: 'styles' }],
    },
  ],
});
