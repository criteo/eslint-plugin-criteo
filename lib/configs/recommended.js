'use strict';

module.exports = {
  plugins: ['@typescript-eslint', 'no-only-tests', 'rxjs', 'rxjs-angular', 'simple-import-sort'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:rxjs/recommended'],
  rules: {
    'criteo/ngx-component-display': 'error',
    'criteo/ngxs-selector-array-length': 'error',
    'no-only-tests/no-only-tests': 'error',
    'rxjs/finnish': 'error',
    'rxjs/no-unsafe-takeuntil': ['error', { alias: ['untilDestroyed'] }],
    'rxjs-angular/prefer-takeuntil': [
      'error',
      {
        alias: ['untilDestroyed'],
        checkComplete: false,
        checkDecorators: ['Component'],
        checkDestroy: false,
      },
    ],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': ['error', { groups: [['^\\u0000', '^@?\\w', '^[^.]', '^\\.']] }],
  },
};
