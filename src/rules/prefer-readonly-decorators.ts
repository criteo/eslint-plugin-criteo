import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#prefer-readonly-decorators';

type MessageIds = 'default';
type Docs = { recommended: 'error' };
type RuleOptions = { decorators?: string[] };
type Options = [RuleOptions?];

function getDecoratorName(node: TSESTree.Decorator): string | undefined {
  const { expression } = node;
  if (expression.type === AST_NODE_TYPES.Identifier) {
    return expression.name;
  }

  if (expression.type === AST_NODE_TYPES.CallExpression && expression.callee.type === AST_NODE_TYPES.Identifier) {
    return expression.callee.name;
  }

  return undefined;
}

function getPropertyName(key: TSESTree.PropertyName | TSESTree.PrivateIdentifier): string {
  if (key.type === AST_NODE_TYPES.Identifier) {
    return key.name;
  }

  if (key.type === AST_NODE_TYPES.PrivateIdentifier) {
    return `#${key.name}`;
  }

  if (key.type === AST_NODE_TYPES.Literal) {
    return String(key.value);
  }

  return '<unknown>';
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prefer "readonly" decorated properties',
      recommended: 'error',
    },
    messages: {
      default: `Decorated property "{{ name }}" should be readonly. ${moreInfo}`,
    },
    defaultOptions: [{}],
    schema: [
      {
        description: 'Configuration listing decorators that require readonly class properties.',
        type: 'object',
        properties: {
          decorators: {
            type: 'array',
            description: 'Decorator names that should only be used on readonly class properties.',
            items: {
              type: 'string',
              description: 'Decorator identifier to enforce.',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0];
    const decorators = new Set(options?.decorators ?? []);

    const checkDecorator = (node: TSESTree.Decorator): void => {
      const decoratorName = getDecoratorName(node);
      if (!decoratorName || !decorators.has(decoratorName)) {
        return;
      }

      const parent = node.parent;
      if (
        parent.type !== AST_NODE_TYPES.PropertyDefinition &&
        parent.type !== AST_NODE_TYPES.TSAbstractPropertyDefinition
      ) {
        return;
      }

      if (!parent.readonly) {
        context.report({
          data: { name: getPropertyName(parent.key) },
          messageId: 'default',
          node,
        });
      }
    };

    return {
      'ClassProperty > Decorator': checkDecorator,
      'PropertyDefinition > Decorator': checkDecorator,
    };
  },
};

export default rule;
