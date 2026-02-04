import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#ngx-component-display';

type MessageIds = 'missingProperty' | 'missingReadonly' | 'invalidValue' | 'missingDecorator' | 'invalidDecoratorValue';
type Docs = { recommended: 'error' };
type RuleOptions = { ignore?: string; propertyName?: string };
type Options = [RuleOptions?];

function getDecoratorName(decorator: TSESTree.Decorator): string | undefined {
  const { expression } = decorator;
  if (expression.type === AST_NODE_TYPES.Identifier) {
    return expression.name;
  }

  if (expression.type === AST_NODE_TYPES.CallExpression && expression.callee.type === AST_NODE_TYPES.Identifier) {
    return expression.callee.name;
  }

  return undefined;
}

function getPropertyName(key: TSESTree.PropertyName | TSESTree.PrivateIdentifier): string | undefined {
  if (key.type === AST_NODE_TYPES.Identifier) {
    return key.name;
  }

  if (key.type === AST_NODE_TYPES.Literal) {
    return typeof key.value === 'string' ? key.value : String(key.value);
  }

  return undefined;
}

function buildReport(
  node: TSESTree.ClassDeclaration,
  messageId: MessageIds,
  propertyName: string,
): TSESLint.ReportDescriptor<MessageIds> {
  return {
    data: { name: node.id?.name ?? '<anonymous>', propertyName },
    messageId,
    node,
  };
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "Define components' display mode to avoid them being rendered as inline (default value if unspecified)",
      recommended: 'error',
    },
    messages: {
      missingProperty: `Missing '{{ propertyName }}' property in component '{{ name }}'. Please define '@HostBinding('class.cds-display-block') readonly {{ propertyName }} = true;'. Valid values: cds-display-block, cds-display-inline, cds-display-inline-block. With the default config, this rule is disabled for components whose names end with 'DialogComponent' or 'ModalComponent'. ${moreInfo}`,
      missingReadonly: `'{{ propertyName }}' property should be 'readonly' in component '{{ name }}'. ${moreInfo}`,
      invalidValue: `{{ propertyName }} value should be 'true' in component '{{ name }}'. ${moreInfo}`,
      missingDecorator: `'{{ propertyName }}' property should be decorated with '@HostBinding()' in component '{{ name }}'. ${moreInfo}`,
      invalidDecoratorValue: `Invalid '@HostBinding' value on '{{ propertyName }}' property in component '{{ name }}'. Valid values: cds-display-block, cds-display-inline, cds-display-inline-block. ${moreInfo}`,
    },
    defaultOptions: [{}],
    schema: [
      {
        description: 'Optional configuration for component classes ignored by the rule and display property name.',
        type: 'object',
        properties: {
          ignore: {
            type: 'string',
            description: 'Regular expression source for component class names that should be ignored.',
          },
          propertyName: {
            type: 'string',
            description: 'Name of the class property that stores the display host binding flag.',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0];
    const ignore = new RegExp(options?.ignore ?? '^.*(?:Dialog|Modal)Component$');
    const propertyName = options?.propertyName ?? 'cdsDisplay';

    const checkClassDeclaration = (node: TSESTree.ClassDeclaration): void => {
      const decorators = node.decorators ?? [];
      const isComponent = decorators.some((decorator) => getDecoratorName(decorator) === 'Component');
      if (!isComponent) {
        return;
      }

      if (node.id && ignore.test(node.id.name)) {
        return;
      }

      const displayNode = node.body.body.find(
        (element): element is TSESTree.PropertyDefinition =>
          element.type === AST_NODE_TYPES.PropertyDefinition && getPropertyName(element.key) === propertyName,
      );

      if (!displayNode) {
        context.report(buildReport(node, 'missingProperty', propertyName));
        return;
      }

      if (!displayNode.readonly) {
        context.report(buildReport(node, 'missingReadonly', propertyName));
        return;
      }

      if (displayNode.value?.type !== AST_NODE_TYPES.Literal || displayNode.value.value !== true) {
        context.report(buildReport(node, 'invalidValue', propertyName));
        return;
      }

      const hostBindingDecorator = (displayNode.decorators ?? []).find(
        (decorator) => getDecoratorName(decorator) === 'HostBinding',
      );
      if (!hostBindingDecorator) {
        context.report(buildReport(node, 'missingDecorator', propertyName));
        return;
      }

      if (hostBindingDecorator.expression.type !== AST_NODE_TYPES.CallExpression) {
        context.report(buildReport(node, 'invalidDecoratorValue', propertyName));
        return;
      }

      const decoratorArgument = hostBindingDecorator.expression.arguments[0];
      if (
        hostBindingDecorator.expression.arguments.length !== 1 ||
        decoratorArgument?.type !== AST_NODE_TYPES.Literal ||
        typeof decoratorArgument.value !== 'string' ||
        !decoratorArgument.value.startsWith('class.cds-display-')
      ) {
        context.report(buildReport(node, 'invalidDecoratorValue', propertyName));
      }
    };

    return {
      ClassDeclaration: checkClassDeclaration,
    };
  },
};

export default rule;
