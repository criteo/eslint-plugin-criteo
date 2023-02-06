/**
 * @fileoverview no-null-undefined-comparison
 * @author Xavier Dupessey
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid comparisons with `null` and `undefined`',
      recommended: 'error',
    },
    messages: {
      default: 'Comparisons with `null` and `undefined` are forbidden, please use isNil (from lodash) instead.',
    },
    schema: [],
  },

  create(context) {
    const check = function (node) {
      if (
        (node.right.type === 'Identifier' && node.right.name === 'undefined') ||
        (node.left.type === 'Identifier' && node.left.name === 'undefined') ||
        (node.right.type === 'Literal' && node.right.value === null) ||
        (node.left.type === 'Literal' && node.left.value === null)
      ) {
        return context.report({ messageId: 'default', node });
      }
    };

    return {
      BinaryExpression: check,
    };
  },
};
