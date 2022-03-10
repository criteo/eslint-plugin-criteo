'use strict';

module.exports = {
  plugins: ['@angular-eslint/template'],
  extends: ['plugin:@angular-eslint/template/recommended'],
  parser: '@angular-eslint/template-parser',
  rules: {
    '@angular-eslint/template/use-track-by-function': 'error',
  },
};
