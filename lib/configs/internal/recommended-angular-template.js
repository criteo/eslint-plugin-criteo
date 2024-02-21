'use strict';

module.exports = {
  plugins: ['@angular-eslint/template'],
  extends: ['plugin:@angular-eslint/template/recommended'],
  parser: '@angular-eslint/template-parser',
  rules: {
    '@angular-eslint/template/alt-text': 'error',
    '@angular-eslint/template/elements-content': 'error',
    '@angular-eslint/template/label-has-associated-control': 'error',
    '@angular-eslint/template/no-call-expression': 'error',
    '@angular-eslint/template/no-duplicate-attributes': 'error',
    '@angular-eslint/template/no-positive-tabindex': 'error',
    '@angular-eslint/template/use-track-by-function': 'error',
    '@angular-eslint/template/valid-aria': 'error',
  },
};
