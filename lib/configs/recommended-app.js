'use strict';

module.exports = {
  plugins: ['cypress'],
  extends: [
    './configs/recommended',
    'plugin:cypress/recommended',
  ],
  rules: {
    'cypress/no-force': 'error'
  },
};
