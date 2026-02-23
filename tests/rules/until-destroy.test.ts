import rule from '../../lib/rules/until-destroy.js';
import { untypedRuleTester } from '../rule-tester';
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

untypedRuleTester.run('until-destroy', rule as RuleModule<string, readonly unknown[]>, {
  valid: [
    {
      code: "import { untilDestroyed } from 'another-package';",
      filename: '/project/foo.ts',
    },
    {
      code: "import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';",
      filename: '/project/foo.ts',
    },
    {
      code: "import { UntilDestroy } from '@ngneat/until-destroy';",
      filename: '/project/foo.spec.ts',
    },
    {
      // Non-named imports should be ignored safely.
      code: "import UntilDestroy from '@ngneat/until-destroy';",
      filename: '/project/foo.ts',
    },
    {
      // Non-named imports should be ignored safely.
      code: "import * as untilDestroy from '@ngneat/until-destroy';",
      filename: '/project/foo.ts',
    },
    {
      code: "import '@ngneat/until-destroy';",
      filename: '/project/foo.ts',
    },
  ],
  invalid: [
    {
      code: "import { untilDestroyed } from '@ngneat/until-destroy';",
      filename: '/project/foo.ts',
      errors: [{ messageId: 'missingDecorator' }],
    },
    {
      code: "import { untilDestroyed as ud } from '@ngneat/until-destroy';",
      filename: '/project/foo.ts',
      errors: [{ messageId: 'missingDecorator' }],
    },
    {
      code: "import { UntilDestroy } from '@ngneat/until-destroy';",
      filename: '/project/foo.ts',
      errors: [{ messageId: 'unnecessaryDecorator' }],
    },
  ],
});
