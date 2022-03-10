/**
 * @fileoverview ngx-component-display
 * @author Xavier Dupessey
 */
'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: `Define components' display mode to avoid them being rendered as inline (default value if unspecified)`,
      recommended: 'error',
    },
    messages: {
      missingProperty: `Missing '{{ propertyName }}' property in component '{{ name }}'. Please define '@HostBinding('class.cds-display-block') readonly {{ propertyName }} = true;'. Valid values: cds-display-block, cds-display-inline, cds-display-inline-block`,
      missingReadonly: `'{{ propertyName }}' property should be 'readonly' in component '{{ name }}'`,
      invalidValue: `{{ propertyName }} value should be 'true' in component '{{ name }}'`,
      missingDecorator: `'{{ propertyName }}' property should be decorated with '@HostBinding()' in component '{{ name }}'`,
      invalidDecoratorValue: `Invalid '@HostBinding' value on '{{ propertyName }}' property in component '{{ name }}'. Valid values: cds-display-block, cds-display-inline, cds-display-inline-block`,
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignore: { type: 'string' },
          propertyName: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const ignore = new RegExp(options.ignore || '^.*DialogComponent$');
    const propertyName = options.propertyName || 'cdsDisplay';

    return {
      ClassDeclaration: function (node) {
        // The rule is only relevant on components
        if (!(node.decorators || []).some((decorator) => decorator.expression.callee.name === 'Component')) {
          return;
        }

        // Skip if component's name is explicitly allowed
        if (ignore.test(node.id.name)) {
          return;
        }

        // Try to get the display property
        const displayNode = node.body.body
          .filter((n) => n.type === 'ClassProperty' || n.type === 'PropertyDefinition')
          .find((n) => n.key.name === propertyName);

        if (!displayNode) {
          return context.report(buildReport(node, 'missingProperty', propertyName));
        }

        // Check it is readonly
        if (!displayNode.readonly) {
          return context.report(buildReport(node, 'missingReadonly', propertyName));
        }

        // Check value is true
        if (displayNode.value.value !== true) {
          return context.report(buildReport(node, 'invalidValue', propertyName));
        }

        // Try to get the HostBinding decorator
        const decorator = (displayNode.decorators || []).find(
          (decorator) => decorator.expression.callee.name === 'HostBinding'
        );

        if (!decorator) {
          return context.report(buildReport(node, 'missingDecorator', propertyName));
        }

        // Check decorator value is valid
        if (
          decorator.expression.arguments.length !== 1 ||
          !decorator.expression.arguments[0].value.startsWith('class.cds-display-')
        ) {
          return context.report(buildReport(node, 'invalidDecoratorValue', propertyName));
        }
      },
    };
  },
};

function buildReport(node, messageId, propertyName) {
  return {
    data: { name: node.id.name, propertyName },
    messageId,
    node,
  };
}
