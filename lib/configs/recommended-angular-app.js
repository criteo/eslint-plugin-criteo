'use strict';

module.exports = {
  plugins: ['cypress'],
  extends: ['./configs/recommended-angular', 'plugin:cypress/recommended'],
  rules: {
    'criteo/cypress-no-force': 'error',
  },
};
