import rule from '../../lib/rules/independent-folders.js';
import { untypedRuleTester } from '../rule-tester';
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

const baseOptions = [
  {
    basePath: '/project',
    featureFolders: ['feature-a', 'feature-b'],
    sharedFolders: ['shared'],
  },
];

untypedRuleTester.run('independent-folders', rule as RuleModule<string, readonly unknown[]>, {
  valid: [
    {
      code: "import local from './local';",
      filename: '/project/feature-a/file.ts',
      options: baseOptions,
    },
    {
      code: "import shared from '../shared/util';",
      filename: '/project/feature-a/file.ts',
      options: baseOptions,
    },
    {
      code: "import feature from '../feature-a/util';",
      filename: '/project/other/file.ts',
      options: baseOptions,
    },
    {
      code: "import pkg from 'feature-b';",
      filename: '/project/feature-a/file.ts',
      options: baseOptions,
    },
  ],
  invalid: [
    {
      code: "import feature from '../feature-b/util';",
      filename: '/project/feature-a/file.ts',
      options: baseOptions,
      errors: [{ messageId: 'error' }],
    },
    {
      code: "import feature from '../feature-a/util';",
      filename: '/project/shared/file.ts',
      options: baseOptions,
      errors: [{ messageId: 'error' }],
    },
    {
      // Importing a feature folder root should also be forbidden.
      code: "import feature from '../feature-b';",
      filename: '/project/feature-a/file.ts',
      options: baseOptions,
      errors: [{ messageId: 'error' }],
    },
  ],
});
