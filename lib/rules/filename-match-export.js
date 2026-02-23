/**
 * @fileoverview filename-match-export
 * @author Xavier Dupessey
 */
'use strict';

import path from 'node:path';

const clean = (value) => (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#filename-match-export`;

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'File name should match exported member',
      recommended: 'error',
    },
    messages: {
      error: `Filename "{{ filename }}" does not match any of "{{ exported }}". ${moreInfo}`,
    },
    defaultOptions: [{ removeFromFilename: [] }],
    schema: [
      {
        type: 'object',
        properties: {
          removeFromFilename: {
            type: 'array',
            description: 'Fragments to strip from the filename before comparing to exported names.',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const removeFromFilename = options.removeFromFilename || [];

    const exportedClean = new Set();
    const exported = [];

    return {
      ExportNamedDeclaration: function (node) {
        const exportedNames = [];

        // ClassDeclaration
        if (node.declaration?.id?.name) {
          exportedNames.push(node.declaration.id.name);
        }

        // VariableDeclarator
        else if (node.declaration?.declarations?.length) {
          exportedNames.push(...node.declaration.declarations.map((declaration) => declaration.id?.name));
        }

        // ExportNamedDeclaration
        else if (node.specifiers?.length) {
          exportedNames.push(...node.specifiers.map((specifier) => specifier.exported?.name));
        }

        exportedNames.forEach((exportedName) => {
          if (typeof exportedName !== 'string' || exportedName.length === 0) {
            return;
          }

          exported.push(exportedName);
          exportedClean.add(clean(exportedName));
        });
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

        filenameClean = clean(filenameClean);

        if (!exportedClean.has(filenameClean)) {
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
