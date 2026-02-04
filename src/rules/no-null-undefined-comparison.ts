import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#no-null-undefined-comparison';

type MessageIds = 'default';
type Options = [];
type Docs = { recommended: 'error' };

function isUndefinedIdentifier(node: TSESTree.Expression | TSESTree.PrivateIdentifier): boolean {
  return node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined';
}

function isNullLiteral(node: TSESTree.Expression | TSESTree.PrivateIdentifier): boolean {
  return node.type === AST_NODE_TYPES.Literal && node.value === null;
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
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
    const check = (node: TSESTree.BinaryExpression): void => {
      if (
        isUndefinedIdentifier(node.left) ||
        isUndefinedIdentifier(node.right) ||
        isNullLiteral(node.left) ||
        isNullLiteral(node.right)
      ) {
        context.report({ messageId: 'default', node });
      }
    };

    return {
      BinaryExpression: check,
    };
  },
};

export default rule;
