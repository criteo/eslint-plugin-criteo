/**
 * @fileoverview filename-match-export
 * @author Xavier Dupessey
 */
'use strict';

const path = require('path');

const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#filename-match-export`;

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'File name should match exported member',
      recommended: 'error',
    },
    messages: {
      error: `Filename "{{ filename }}" does not match any of "{{ exported }}". ${moreInfo}`,
    },
    schema: [
      {
        type: 'object',
        properties: {
          removeFromFilename: { type: 'array' },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const removeFromFilename = options.removeFromFilename || [];

    const lowercaseExported = new Set();
    const exported = [];

    return {
      ExportNamedDeclaration: function (node) {
        if (node.declaration.id && node.declaration.id.name) {
          exported.push(node.declaration.id.name);
          lowercaseExported.add(node.declaration.id.name.toLowerCase());
        }
      },
      'Program:exit': function (node) {
        // Nothing is exported, allow any name
        if (exported.length === 0) {
          return;
        }

        const filename = path.parse(context.getFilename());
        let filenameClean = filename.name;

        for (const remove of removeFromFilename) {
          filenameClean = filenameClean.replace(remove, '');
        }

        filenameClean = filenameClean.toLowerCase().replace(/[^a-z0-9]+/g, '');

        if (!lowercaseExported.has(filenameClean)) {
          return context.report({
            data: { filename: filename.base, exported: exported.join('" | "') },
            messageId: 'error',
            node,
          });
        }
      },
    };
  },
};
