/**
 * @fileoverview ngxs-selector-array-length
 * @author Benjamin Chadwick
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'The number of parameters passed to a selector function should match the length of the array passed to @Selector().',
      recommended: 'error',
    },
    messages: {
      mismatch: `The number of parameters passed to selector function '{{ selectorFunction }}' should match the length of the array passed to @Selector()`,
    },
    schema: [],
  },

  create(context) {
    return {
      MethodDefinition: function (node) {
        if (!node.decorators) {
          return;
        }

        const selectorDecorator = node.decorators.find((decorator) => decorator.expression.callee.name === 'Selector');
        if (!selectorDecorator) {
          // the method does not have the @Selector() decorator
          return;
        }

        const selectorDecoratorArgument = selectorDecorator && selectorDecorator.expression.arguments[0];

        if (!selectorDecoratorArgument) {
          // the @Selector() decorator is called with no arguments (this is allowed as the state is passed implicitly)
          return;
        }

        if (node.value.params.length !== selectorDecoratorArgument.elements.length) {
          return context.report({
            data: { selectorFunction: node.key.name },
            messageId: 'mismatch',
            node,
          });
        }
      },
    };
  },
};
