'use strict';

module.exports = {
  plugins: ['rxjs', 'simple-import-sort'],
  rules: {
    'criteo/ngx-component-display': 'error',
    'criteo/ngxs-selector-array-length': 'error',
    'rxjs/no-unsafe-takeuntil': ['error', { alias: ['untilDestroyed'] }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': ['error', { groups: [['^\\u0000', '^@?\\w', '^[^.]', '^\\.']] }],
  },
};
