/**
 * @fileoverview no-null-undefined-comparison
 * @author Xavier Dupessey
 */
'use strict';

const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#no-null-undefined-comparison`;

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid comparisons with `null` and `undefined`',
      recommended: 'error',
    },
    messages: {
      default: `Comparisons with null and undefined are forbidden, please use isNil (from lodash or criteo-angular-sdk) instead. ${moreInfo}`,
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
