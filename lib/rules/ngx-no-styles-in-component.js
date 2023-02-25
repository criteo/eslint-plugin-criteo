/**
 * @fileoverview ngx-no-styles-in-component
 * @author Benjamin Chadwick
 */
'use strict';

const { STYLE_URLS_SELECTOR, STYLES_SELECTOR } = require("../utils/selectors");

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use the design system for styles instead of adding CSS to a component',
      recommended: 'error',
    },
    messages: {
      styles: 'Where possible, prefer components and CSS classes from the design system library',
    },
    schema: [],
  },

  create(context) {
    function report(node) {
      context.report({ node, messageId: 'styles' });
    }

    return {
      [STYLES_SELECTOR]: report,
      [STYLE_URLS_SELECTOR]: report,
    };
  },
};

