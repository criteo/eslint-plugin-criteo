import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#cypress-no-force';

type MessageIds = 'unexpected';
type Options = [];
type Docs = { recommended: 'error' };

const cypressMethodNames = new Set(['click', 'dblclick', 'type', 'trigger', 'check', 'rightclick', 'focus', 'select']);

function getMemberName(memberExpression: TSESTree.MemberExpression): string | undefined {
  const { property } = memberExpression;
  if (property.type === AST_NODE_TYPES.Identifier) {
    return property.name;
  }

  if (property.type === AST_NODE_TYPES.Literal) {
    if (typeof property.value === 'string' || typeof property.value === 'number') {
      return String(property.value);
    }
  }

  return undefined;
}

function getCalledMethodName(node: TSESTree.CallExpression): string | undefined {
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
    return undefined;
  }

  return getMemberName(node.callee);
}

function hasOptionForce(node: TSESTree.CallExpression): boolean {
  return node.arguments.some((argument) => {
    if (argument.type !== AST_NODE_TYPES.ObjectExpression) {
      return false;
    }

    return argument.properties.some((property) => {
      if (property.type !== AST_NODE_TYPES.Property) {
        return false;
      }

      let keyName: string | undefined;
      if (property.key.type === AST_NODE_TYPES.Identifier) {
        keyName = property.key.name;
      } else if (property.key.type === AST_NODE_TYPES.Literal && typeof property.key.value === 'string') {
        keyName = property.key.value;
      }

      return keyName === 'force' && property.value.type === AST_NODE_TYPES.Literal && property.value.value === true;
    });
  });
}

function isCypressCall(context: TSESLint.RuleContext<MessageIds, Options>, node: TSESTree.CallExpression): boolean {
  const parserServices = context.sourceCode.parserServices;
  if (!parserServices?.program || typeof parserServices.getTypeAtLocation !== 'function') {
    return false;
  }

  const type = parserServices.getTypeAtLocation(node);
  const symbol = type.getSymbol();
  if (!symbol || symbol.getName() !== 'Chainable') {
    return false;
  }

  return (
    symbol.declarations?.some((declaration) => {
      let current: ts.Node | undefined = declaration;
      while (current) {
        if (ts.isModuleDeclaration(current) && ts.isIdentifier(current.name) && current.name.text === 'Cypress') {
          return true;
        }

        current = current.parent;
      }

      return false;
    }) ?? false
  );
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
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
    const checkCallExpression = (node: TSESTree.CallExpression): void => {
      const methodName = getCalledMethodName(node);
      if (
        !methodName ||
        !cypressMethodNames.has(methodName) ||
        !hasOptionForce(node) ||
        !isCypressCall(context, node)
      ) {
        return;
      }

      context.report({ node, messageId: 'unexpected' });
    };

    return {
      CallExpression: checkCallExpression,
    };
  },
};

export default rule;
