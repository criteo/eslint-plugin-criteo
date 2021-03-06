'use strict';

const recommendedApp = require('./configs/recommended-app.js');
const recommendedLib = require('./configs/recommended-lib.js');
const recommendedTemplate = require('./configs/recommended-template.js');
const requireIndex = require('requireindex');

module.exports = {
  configs: {
    'recommended-app': recommendedApp,
    'recommended-lib': recommendedLib,
    'recommended-template': recommendedTemplate,
  },
  rules: requireIndex(__dirname + '/rules'),
};
