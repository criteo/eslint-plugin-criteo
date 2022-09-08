'use strict';

const recommendedApp = require('./configs/recommended-app.js');
const recommendedReactApp = require('./configs/recommended-react-app.js');
const recommendedLib = require('./configs/recommended-lib.js');
const recommendedTemplate = require('./configs/recommended-template.js');
const requireIndex = require('requireindex');

module.exports = {
  configs: {
    'recommended-app': recommendedApp,
    'recommended-react-app': recommendedReactApp,
    'recommended-lib': recommendedLib,
    'recommended-template': recommendedTemplate,
  },
  rules: requireIndex(__dirname + '/rules'),
};
