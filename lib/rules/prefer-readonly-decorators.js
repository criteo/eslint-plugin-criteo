/**
 * @fileoverview prefer-readonly-decorators
 * @author Xavier Dupessey
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prefer "readonly" decorated properties',
      recommended: 'error',
    },
    messages: {
      default: 'Decorated property "{{ name }}" should be readonly',
    },
    schema: [
      {
        type: 'object',
        properties: {
          decorators: { type: 'array' },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const decorators = new Set(options.decorators);

    const check = function (node) {
      if (decorators.has(node.expression.callee.name) && !node.parent.readonly) {
        return context.report({ data: { name: node.parent.key.name }, messageId: 'default', node });
      }
    };

    return {
      'ClassProperty > Decorator': check,
      'PropertyDefinition > Decorator': check,
    };
  },
};
