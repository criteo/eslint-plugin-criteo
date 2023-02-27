'use strict';

module.exports = {
  plugins: ['react', 'react-hooks', 'simple-import-sort'],
  extends: ['./recommended', 'plugin:react/recommended'],
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [['^\\u0000', '^react$', '^@?\\w', '^[^.]', '^\\.']],
      },
    ],
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
