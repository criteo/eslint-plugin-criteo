'use strict';

const requireIndex = require('requireindex');

module.exports = {
  configs: requireIndex(
    __dirname + '/configs',
    [
      'recommended',
      'recommended-angular-app',
      'recommended-angular-lib',
      'recommended-angular-template',
      'recommended-app',
      'recommended-lib',
      'recommended-react-app',
      'recommended-react-lib',
      'recommended-template',
    ]),
  rules: requireIndex(__dirname + '/rules'),
};
