/**
 * @fileoverview ngx-component-display
 * @author Xavier Dupessey
 */
'use strict';

const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#ngx-component-display`;

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: `Define components' display mode to avoid them being rendered as inline (default value if unspecified)`,
      recommended: 'error',
    },
    messages: {
      missingProperty: `Missing '{{ propertyName }}' property in component '{{ name }}'. Please define '@HostBinding('class.cds-display-block') readonly {{ propertyName }} = true;'. Valid values: cds-display-block, cds-display-inline, cds-display-inline-block. With the default config, this rule is disabled for components whose names end with 'DialogComponent' or 'ModalComponent'. ${moreInfo}`,
      missingReadonly: `'{{ propertyName }}' property should be 'readonly' in component '{{ name }}'. ${moreInfo}`,
      invalidValue: `{{ propertyName }} value should be 'true' in component '{{ name }}'. ${moreInfo}`,
      missingDecorator: `'{{ propertyName }}' property should be decorated with '@HostBinding()' in component '{{ name }}'. ${moreInfo}`,
      invalidDecoratorValue: `Invalid '@HostBinding' value on '{{ propertyName }}' property in component '{{ name }}'. Valid values: cds-display-block, cds-display-inline, cds-display-inline-block. ${moreInfo}`,
    },
    defaultOptions: [{ ignore: '^.*(?:Dialog|Modal)Component$', propertyName: 'cdsDisplay' }],
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'string',
            description: 'Regex string for component names that should be ignored.',
          },
          propertyName: {
            type: 'string',
            description: 'Class property name that carries the HostBinding display class.',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const ignore = new RegExp(options.ignore || '^.*(?:Dialog|Modal)Component$');
    const propertyName = options.propertyName || 'cdsDisplay';

    return {
      ClassDeclaration: function (node) {
        // The rule is only relevant on components
        if (!(node.decorators || []).some((decorator) => getDecoratorName(decorator) === 'Component')) {
          return;
        }

        // Skip if component's name is explicitly allowed
        if (node.id && ignore.test(node.id.name)) {
          return;
        }

        // Try to get the display property
        const displayNode = node.body.body
          .filter((n) => n.type === 'ClassProperty' || n.type === 'PropertyDefinition')
          .find((n) => getPropertyName(n.key) === propertyName);

        if (!displayNode) {
          return context.report(buildReport(node, 'missingProperty', propertyName));
        }

        // Check it is readonly
        if (!displayNode.readonly) {
          return context.report(buildReport(node, 'missingReadonly', propertyName));
        }

        // Check value is true
        if (displayNode.value?.type !== 'Literal' || displayNode.value.value !== true) {
          return context.report(buildReport(node, 'invalidValue', propertyName));
        }

        // Try to get the HostBinding decorator
        const decorator = (displayNode.decorators || []).find(
          (decorator) => getDecoratorName(decorator) === 'HostBinding',
        );

        if (!decorator) {
          return context.report(buildReport(node, 'missingDecorator', propertyName));
        }

        if (decorator.expression.type !== 'CallExpression') {
          return context.report(buildReport(node, 'invalidDecoratorValue', propertyName));
        }

        const argument = decorator.expression.arguments[0];

        // Check decorator value is valid
        if (
          decorator.expression.arguments.length !== 1 ||
          argument?.type !== 'Literal' ||
          typeof argument.value !== 'string' ||
          !argument.value.startsWith('class.cds-display-')
        ) {
          return context.report(buildReport(node, 'invalidDecoratorValue', propertyName));
        }
      },
    };
  },
};

function buildReport(node, messageId, propertyName) {
  return {
    data: { name: node.id?.name || '<anonymous>', propertyName },
    messageId,
    node,
  };
}

function getDecoratorName(decorator) {
  const expression = decorator.expression;

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

  return undefined;
}
