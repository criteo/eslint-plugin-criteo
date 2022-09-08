'use strict';

module.exports = {
  plugins: ['@typescript-eslint', 'no-only-tests', 'simple-import-sort', 'react', 'react-hook'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
  rules: {
    'criteo/no-todo-without-ticket': 'error',
    'no-only-tests/no-only-tests': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [['^\\u0000', '^react$', '^@?\\w', '^[^.]', '^\\.']],
      },
    ],
    'criteo/cypress-no-force': 'error',
    'react/hook-use-state': 'error',
    'react/no-arrow-function-lifecycle': 'error',
    'react/no-invalid-html-attribute': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-wrap-multilines': 'error',
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-boolean-value': 'error',
    'react/no-unused-state': 'error',
  },
};
