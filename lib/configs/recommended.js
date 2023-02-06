'use strict';

module.exports = {
  plugins: ['@angular-eslint', '@typescript-eslint', 'no-only-tests', 'rxjs', 'rxjs-angular', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@angular-eslint/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:rxjs/recommended',
  ],
  rules: {
    '@angular-eslint/no-lifecycle-call': 'error',
    '@angular-eslint/no-pipe-impure': 'error',
    '@angular-eslint/prefer-on-push-component-change-detection': 'error',
    '@angular-eslint/relative-url-prefix': 'error',
    '@angular-eslint/use-component-view-encapsulation': 'error',
    'criteo/filename': 'error',
    'criteo/filename-match-export': ['error', { removeFromFilename: ['.actions'] }],
    'criteo/ngx-component-display': 'error',
    'criteo/ngxs-selector-array-length': 'error',
    'criteo/no-ngxs-select-decorator': 'error',
    'criteo/no-null-undefined-comparison': 'error',
    'criteo/no-todo-without-ticket': 'error',
    'criteo/prefer-readonly-decorators': 'error',
    'criteo/until-destroy': 'error',
    'no-only-tests/no-only-tests': 'error',
    'rxjs-angular/prefer-takeuntil': [
      'error',
      { alias: ['untilDestroyed'], checkComplete: false, checkDecorators: ['Component'], checkDestroy: false },
    ],
    'rxjs/finnish': ['error', { functions: false, methods: false, strict: true }],
    'rxjs/no-unsafe-takeuntil': ['error', { alias: ['untilDestroyed'] }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': ['error', { groups: [['^\\u0000', '^@?\\w', '^[^.]', '^\\.']] }],
  },
};
