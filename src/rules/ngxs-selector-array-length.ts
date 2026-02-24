import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#ngxs-selector-array-length';

type MessageIds = 'mismatch';
type Options = [];
type Docs = { recommended: 'error' };

function getDecoratorName(decorator: TSESTree.Decorator): string | undefined {
  if (decorator.expression.type === AST_NODE_TYPES.Identifier) {
    return decorator.expression.name;
  }

  if (
    decorator.expression.type === AST_NODE_TYPES.CallExpression &&
    decorator.expression.callee.type === AST_NODE_TYPES.Identifier
  ) {
    return decorator.expression.callee.name;
  }

  return undefined;
}

function getMethodName(key: TSESTree.PropertyName): string {
  if (key.type === AST_NODE_TYPES.Identifier) {
    return key.name;
  }

  if (key.type === AST_NODE_TYPES.Literal && typeof key.value === 'string') {
    return key.value;
  }

  return '<unknown>';
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'The number of parameters passed to a selector function should match the length of the array passed to @Selector().',
      recommended: 'error',
    },
    messages: {
      mismatch: `The number of parameters passed to selector function '{{ selectorFunction }}' should match the length of the array passed to @Selector(). ${moreInfo}`,
    },
    schema: [],
  },
  create(context) {
    const checkMethodDefinition = (node: TSESTree.MethodDefinition): void => {
      if (!node.decorators) {
        return;
      }

      const selectorDecorator = node.decorators.find((decorator) => getDecoratorName(decorator) === 'Selector');
      if (!selectorDecorator || selectorDecorator.expression.type !== AST_NODE_TYPES.CallExpression) {
        return;
      }

      const selectorDecoratorArgument = selectorDecorator.expression.arguments[0];
      if (!selectorDecoratorArgument || selectorDecoratorArgument.type !== AST_NODE_TYPES.ArrayExpression) {
        return;
      }

      if (node.value.params.length !== selectorDecoratorArgument.elements.length) {
        context.report({
          data: { selectorFunction: getMethodName(node.key) },
          messageId: 'mismatch',
          node,
        });
      }
    };

    return {
      MethodDefinition: checkMethodDefinition,
    };
  },
};

export default rule;
