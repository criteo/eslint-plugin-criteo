/**
 * @fileoverview filename
 * @author Xavier Dupessey
 */
'use strict';

import path from 'node:path';
import { COMPONENT_SELECTOR, STYLE_URL_SELECTOR, STYLE_URLS_SELECTOR, TEMPLATE_URL_SELECTOR } from '../utils.js';

const VALID_NAME_REGEX = /^[a-z0-9.-]+$/;

const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#filename`;

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'File names should be consistent',
      recommended: 'error',
    },
    messages: {
      invalidPattern: `File name "{{ filename }}" is invalid, it should match "{{ pattern }}". ${moreInfo}`,
      inconsistent: `File names "{{ expected }}" and "{{ received }}" should be consistent. ${moreInfo}`,
      componentFolder: `The component should be defined in a folder called "{{ dirname }}". ${moreInfo}`,
    },
    defaultOptions: [{}],
    schema: [
      {
        type: 'object',
        properties: {
          pattern: {
            type: 'string',
            description: 'Regular expression string used to validate file names.',
          },
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
        const templatePath = getStaticString(node.value);
        if (!templatePath) {
          return;
        }

        const template = path.parse(templatePath);
        if (template.name !== filename.name) {
          return context.report({
            data: { expected: filename.base, received: template.base },
            messageId: 'inconsistent',
            node,
          });
        }
      },
      [STYLE_URL_SELECTOR]: function (node) {
        const stylePath = getStaticString(node.value);
        if (!stylePath) {
          return;
        }

        const styleUrl = path.parse(stylePath);
        if (styleUrl.name !== filename.name) {
          return context.report({
            data: { expected: filename.base, received: styleUrl.base },
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

        const stylePath = getStaticString(styleUrls[0]);
        if (!stylePath) {
          return;
        }

        const styleUrl = path.parse(stylePath);
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

function getStaticString(node) {
  if (!node) {
    return undefined;
  }

  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }

  if (node.type === 'TemplateLiteral' && node.expressions.length === 0 && node.quasis.length === 1) {
    return node.quasis[0].value.cooked;
  }

  return undefined;
}
