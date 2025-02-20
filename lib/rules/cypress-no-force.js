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
      return (
        node.callee &&
        node.callee.property &&
        node.callee.property.type === 'Identifier' &&
        methodNames.includes(node.callee.property.name)
      );
    }

    function isCypressCall(node) {
      const typeChecker = context.sourceCode.parserServices.program.getTypeChecker();
      const callee = context.sourceCode.parserServices.esTreeNodeToTSNodeMap.get(node.callee);
      const parentType = typeChecker.getTypeAtLocation(callee.parent).getSymbol();

      return !!parentType && parentType.escapedName === 'Chainable' && parentType.parent.escapedName === 'Cypress';
    }

    function hasOptionForce(node) {
      return (
        node &&
        node.arguments &&
        node.arguments.length > 0 &&
        node.arguments.some((arg) => {
          return (
            arg.type === 'ObjectExpression' &&
            arg.properties.some((propNode) => propNode.key && propNode.key.name === 'force')
          );
        })
      );
    }

    return {
      CallExpression(node) {
        if (isCypressCall(node) && isCallingClickOrType(node) && hasOptionForce(node)) {
          context.report({ node, messageId: 'unexpected' });
        }
      },
    };
  },
};
