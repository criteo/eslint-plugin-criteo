import rule from '../../lib/rules/ngx-component-display.js';
import { untypedRuleTester } from '../rule-tester';
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

untypedRuleTester.run('ngx-component-display', rule as RuleModule<string, readonly unknown[]>, {
  valid: [
    {
      code: '@Directive() class MyDirective {}',
    },
    {
      // Ignored by default ignore regex (Dialog/Modal suffix).
      code: '@Component({}) class UserDialogComponent {}',
    },
    {
      code: `
        @Component({})
        class UserComponent {
          @HostBinding('class.cds-display-inline')
          readonly cdsDisplay = true;
        }
      `,
    },
    {
      // Custom propertyName can be configured.
      code: `
        @Component({})
        class UserComponent {
          @HostBinding('class.cds-display-block')
          readonly displayMode = true;
        }
      `,
      options: [{ propertyName: 'displayMode' }],
    },
  ],
  invalid: [
    {
      code: '@Component({}) class UserComponent {}',
      errors: [{ messageId: 'missingProperty' }],
    },
    {
      // Non-call decorator syntax should not crash and is treated as a component.
      code: '@Component class UserComponent {}',
      errors: [{ messageId: 'missingProperty' }],
    },
    {
      code: `
        @Component({})
        class UserComponent {
          @HostBinding('class.cds-display-block')
          cdsDisplay = true;
        }
      `,
      errors: [{ messageId: 'missingReadonly' }],
    },
    {
      code: `
        @Component({})
        class UserComponent {
          @HostBinding('class.cds-display-block')
          readonly cdsDisplay = false;
        }
      `,
      errors: [{ messageId: 'invalidValue' }],
    },
    {
      // Missing initializer should fail with invalidValue rather than crash.
      code: `
        @Component({})
        class UserComponent {
          @HostBinding('class.cds-display-block')
          readonly cdsDisplay;
        }
      `,
      errors: [{ messageId: 'invalidValue' }],
    },
    {
      code: `
        @Component({})
        class UserComponent {
          readonly cdsDisplay = true;
        }
      `,
      errors: [{ messageId: 'missingDecorator' }],
    },
    {
      code: `
        @Component({})
        class UserComponent {
          @HostBinding('class.not-display')
          readonly cdsDisplay = true;
        }
      `,
      errors: [{ messageId: 'invalidDecoratorValue' }],
    },
    {
      // HostBinding without arguments should fail with invalidDecoratorValue.
      code: `
        @Component({})
        class UserComponent {
          @HostBinding
          readonly cdsDisplay = true;
        }
      `,
      errors: [{ messageId: 'invalidDecoratorValue' }],
    },
    {
      // Non-literal argument should fail with invalidDecoratorValue instead of crashing.
      code: `
        const hostClass = 'class.cds-display-block';
        @Component({})
        class UserComponent {
          @HostBinding(hostClass)
          readonly cdsDisplay = true;
        }
      `,
      errors: [{ messageId: 'invalidDecoratorValue' }],
    },
  ],
});
