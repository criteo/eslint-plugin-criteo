/**
 * @fileoverview filename
 * @author Xavier Dupessey
 */
'use strict';

const path = require('path');
const { COMPONENT_SELECTOR, STYLE_URLS_SELECTOR, TEMPLATE_URL_SELECTOR } = require('../utils/selectors');

const VALID_NAME_REGEX = /^[a-z0-9.-]+$/;

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
      componentFolder: 'The component should be defined in a folder called "{{ dirname }}"',
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
      [TEMPLATE_URL_SELECTOR]: function (node) {
        const template = path.parse(node.value.value);
        if (template.name !== filename.name) {
          return context.report({
            data: { expected: filename.base, received: template.base },
            messageId: 'inconsistent',
            node,
          });
        }
      },
      [STYLE_URLS_SELECTOR]: function (node) {
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
      [COMPONENT_SELECTOR]: function (node) {
        const componentDir = filename.dir.split(path.sep).slice(-1)[0];
        const expectedDir = filename.name.replace('.component', '');

        if (componentDir !== expectedDir) {
          return context.report({
            data: { dirname: expectedDir },
            messageId: 'componentFolder',
            node,
          });
        }
      },
    };
  },
};
