'use strict';

module.exports = {
  plugins: ['@typescript-eslint', 'cypress', 'eslint-comments', 'no-only-tests', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'plugin:eslint-comments/recommended',
  ],
  rules: {
    'criteo/cypress-no-force': 'error',
    'criteo/filename': 'error',
    'criteo/filename-match-export': ['error', { removeFromFilename: ['.actions'] }],
    'criteo/no-null-undefined-comparison': 'error',
    'criteo/no-spreading-accumulators': 'error',
    'criteo/no-indexed-access-on-enums': 'error',
    'criteo/no-todo-without-ticket': 'error',
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    'eslint-comments/require-description': 'error',
    'no-only-tests/no-only-tests': 'error',
    'rxjs/finnish': ['error', { functions: false, methods: false, strict: true }],
    'rxjs/no-unsafe-takeuntil': ['error', { alias: ['untilDestroyed'] }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': ['error', { groups: [['^\\u0000', '^@?\\w', '^[^.]', '^\\.']] }],
  },
};
