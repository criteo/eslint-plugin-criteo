'use strict';

const requireIndex = require('requireindex');

module.exports = {
  configs: requireIndex(__dirname + '/configs', [
    'recommended',
    'recommended-angular-app',
    'recommended-angular-lib',
    'recommended-angular-template',
    'recommended-react-app',
    'recommended-react-lib',
  ]),
  rules: requireIndex(__dirname + '/rules'),
};
