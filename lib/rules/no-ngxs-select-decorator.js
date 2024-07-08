/**
 * @fileoverview no-ngxs-select-decorator
 * @author Xavier Dupessey
 */
'use strict';

const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#no-ngxs-select-decorator`;

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid @Select() decorator',
      recommended: 'error',
    },
    messages: {
      default: `@Select() decorator is forbidden, prefer @ViewSelectSnapshot() instead. ${moreInfo}`,
    },
    schema: [],
  },

  create(context) {
    const throwError = function (node) {
      return context.report({ messageId: 'default', node });
    };

    return {
      'ClassProperty > Decorator[expression.callee.name="Select"]': throwError,
      'PropertyDefinition > Decorator[expression.callee.name="Select"]': throwError,
    };
  },
};
