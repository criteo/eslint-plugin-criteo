/**
 * @fileoverview cypress-no-force
 * @author Benjamin Chadwick
 * Adapted from cypress/no-force: https://github.com/cypress-io/eslint-plugin-cypress/blob/master/lib/rules/no-force.js
 */
'use strict';

const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#cypress-no-force`;

export default {
  meta: {
    type: 'problem',
    docs: {
      description: "Cypress: disallow using of 'force: true' option for click and type calls",
      recommended: 'error',
    },
    messages: {
      unexpected: `Do not use force on click and type calls. ${moreInfo}`,
    },
    schema: [],
  },

  create(context) {
    function isCallingClickOrType(node) {
      const methodNames = ['click', 'dblclick', 'type', 'trigger', 'check', 'rightclick', 'focus', 'select'];
      const property = node.callee && node.callee.property;
      const methodName =
        property?.type === 'Identifier' ? property.name : property?.type === 'Literal' ? property.value : undefined;

      return (
        node.callee &&
        (typeof methodName === 'string' || typeof methodName === 'number') &&
        methodNames.includes(String(methodName))
      );
    }

    function isCypressCall(node) {
      const parserServices = context.sourceCode.parserServices;
      if (!parserServices?.program || !parserServices.esTreeNodeToTSNodeMap) {
        return false;
      }

      const callee = parserServices.esTreeNodeToTSNodeMap.get(node.callee);
      if (!callee?.parent) {
        return false;
      }

      const typeChecker = parserServices.program.getTypeChecker();
      const parentType = typeChecker.getTypeAtLocation(callee.parent).getSymbol();

      return !!parentType && parentType.escapedName === 'Chainable' && parentType.parent?.escapedName === 'Cypress';
    }

    function hasOptionForce(node) {
      return (
        node &&
        node.arguments &&
        node.arguments.length > 0 &&
        node.arguments.some((arg) => {
          return (
            arg.type === 'ObjectExpression' &&
            arg.properties.some((propNode) => {
              if (propNode.type !== 'Property' || !propNode.key) {
                return false;
              }

              const keyName =
                propNode.key.type === 'Identifier'
                  ? propNode.key.name
                  : propNode.key.type === 'Literal'
                    ? propNode.key.value
                    : undefined;

              return keyName === 'force' && propNode.value?.type === 'Literal' && propNode.value.value === true;
            })
          );
        })
      );
    }

    return {
      CallExpression(node) {
        if (isCallingClickOrType(node) && hasOptionForce(node) && isCypressCall(node)) {
          context.report({ node, messageId: 'unexpected' });
        }
      },
    };
  },
};
