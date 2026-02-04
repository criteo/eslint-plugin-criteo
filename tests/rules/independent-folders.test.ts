import rule from '../../src/rules/independent-folders.js';
import { untypedRuleTester } from '../rule-tester.js';

const baseOptions: [
  {
    basePath: string;
    featureFolders: string[];
    sharedFolders: string[];
  },
] = [
  {
    basePath: '/project',
    featureFolders: ['feature-a', 'feature-b'],
    sharedFolders: ['shared'],
  },
];

untypedRuleTester.run('independent-folders', rule, {
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
