/**
 * @fileoverview filename
 * @author Xavier Dupessey
 */
'use strict';

const path = require('path');

const VALID_NAME_REGEX = /^[a-z0-9\.\-]+$/;

function metadataProperty(key) {
  return `Property:matches([key.name=${key}][computed=false], [key.value=${key}], [key.quasis.0.value.raw=${key}])`;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'File names should be consistent',
      recommended: 'error',
    },
    messages: {
      invalidPattern: 'File name "{{ filename }}" is invalid, it should match "{{ pattern }}"',
      inconsistent: 'File names "{{ expected }}" and "{{ received }}" should be consistent',
    },
    schema: [
      {
        type: 'object',
        properties: {
          pattern: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const pattern = options.pattern ? new RegExp(options.pattern) : VALID_NAME_REGEX;

    const filename = path.parse(context.getFilename());

    const templateUrlSelector =
      'ClassDeclaration > Decorator[expression.callee.name="Component"] > CallExpression > ObjectExpression > ' +
      metadataProperty('templateUrl');
    const styleUrlsSelector =
      'ClassDeclaration > Decorator[expression.callee.name="Component"] > CallExpression > ObjectExpression > ' +
      metadataProperty('styleUrls');

    return {
      Program: function (node) {
        if (!pattern.test(filename.name)) {
          return context.report({
            data: { filename: filename.base, pattern },
            messageId: 'invalidPattern',
            node,
          });
        }
      },
      [templateUrlSelector]: function (node) {
        const template = path.parse(node.value.value);
        if (template.name !== filename.name) {
          return context.report({
            data: { expected: filename.base, received: template.base },
            messageId: 'inconsistent',
            node,
          });
        }
      },
      [styleUrlsSelector]: function (node) {
        const styleUrls = node.value.elements;
        if (styleUrls.length === 0) {
          return;
        }

        const styleUrl = path.parse(styleUrls[0].value);
        if (styleUrl.name !== filename.name) {
          return context.report({
            data: { expected: filename.base, received: styleUrl.base },
            messageId: 'inconsistent',
            node,
          });
        }
      },
    };
  },
};
