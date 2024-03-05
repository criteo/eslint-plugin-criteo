'use strict';

module.exports = {
  plugins: ['@angular-eslint', '@rdlabo/rules', 'rxjs', 'rxjs-angular'],
  extends: ['./recommended', 'plugin:rxjs/recommended'],
  rules: {
    '@angular-eslint/no-lifecycle-call': 'error',
    '@angular-eslint/no-pipe-impure': 'error',
    '@angular-eslint/prefer-on-push-component-change-detection': 'error',
    '@angular-eslint/relative-url-prefix': 'error',
    '@angular-eslint/use-component-view-encapsulation': 'error',
    '@rdlabo/rules/deny-constructor-di': 'error',
    '@rdlabo/rules/import-inject-object': 'error',
    'criteo/ngx-component-display': 'error',
    'criteo/ngx-no-styles-in-component': 'error',
    'criteo/ngxs-selector-array-length': 'error',
    'criteo/no-ngxs-select-decorator': 'error',
    'criteo/prefer-readonly-decorators': ['error', { decorators: ['Output', 'ViewSelectSnapshot'] }],
    'criteo/until-destroy': 'error',
    'rxjs-angular/prefer-takeuntil': [
      'error',
      { alias: ['untilDestroyed'], checkComplete: false, checkDecorators: ['Component'], checkDestroy: false },
    ],
  },
};
