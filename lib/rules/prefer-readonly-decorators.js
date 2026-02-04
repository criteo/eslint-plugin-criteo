/**
 * @fileoverview prefer-readonly-decorators
 * @author Xavier Dupessey
 */
'use strict';

const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#prefer-readonly-decorators`;

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prefer "readonly" decorated properties',
      recommended: 'error',
    },
    messages: {
      default: `Decorated property "{{ name }}" should be readonly. ${moreInfo}`,
    },
    defaultOptions: [{ decorators: [] }],
    schema: [
      {
        type: 'object',
        properties: {
          decorators: {
            type: 'array',
            description: 'Decorator names that require the target property to be readonly.',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const decorators = new Set(options.decorators);

    const check = function (node) {
      const decoratorName = getDecoratorName(node);
      if (!decoratorName) {
        return;
      }

      if (decorators.has(decoratorName) && !node.parent.readonly) {
        return context.report({ data: { name: getPropertyName(node.parent.key) }, messageId: 'default', node });
      }
    };

    return {
      'ClassProperty > Decorator': check,
      'PropertyDefinition > Decorator': check,
    };
  },
};

function getDecoratorName(node) {
  const expression = node.expression;

  if (expression.type === 'Identifier') {
    return expression.name;
  }

  if (expression.type === 'CallExpression' && expression.callee.type === 'Identifier') {
    return expression.callee.name;
  }

  return undefined;
}

function getPropertyName(key) {
  if (key.type === 'Identifier') {
    return key.name;
  }

  if (key.type === 'Literal') {
    return String(key.value);
  }

  return '<unknown>';
}
