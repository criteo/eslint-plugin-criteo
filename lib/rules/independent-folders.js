/**
 * @fileoverview independent-folders
 * @author Xavier Dupessey
 */
'use strict';

import path from 'node:path';

const isUnderPath = (folderPath, targetPath) => {
  const relative = path.relative(folderPath, targetPath);
  return relative === '' || !relative.startsWith('..');
};

const buildReport = (node, currentFolder, importedFolder) => {
  return {
    data: {
      currentFolder: path.parse(currentFolder).base,
      import: node.source.value,
      importedFolder: path.parse(importedFolder).base,
    },
    messageId: 'error',
    node,
  };
};

const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#independent-folders`;

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Feature folders should be independent and not import form each others',
      recommended: 'error',
    },
    messages: {
      error: `Forbidden import '{{ currentFolder }}' <- '{{ importedFolder }}', do not use '{{ import }}'. ${moreInfo}`,
    },
    schema: [
      {
        type: 'object',
        properties: {
          basePath: { type: 'string' },
          featureFolders: { type: 'array' },
          sharedFolders: { type: 'array' },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const basePath = path.resolve(process.cwd(), options.basePath || './');
    const featureFolders = (options.featureFolders || []).map((folder) => path.resolve(basePath, folder));
    const sharedFolders = (options.sharedFolders || []).map((folder) => path.resolve(basePath, folder));

    const currentFilePath = path.parse(context.getFilename()).dir;
    const otherFeatureFolders = Array.from(featureFolders);

    const featureFolderIndex = featureFolders.findIndex((ff) => isUnderPath(ff, currentFilePath));
    let sharedFolderIndex;
    if (featureFolderIndex !== -1) {
      otherFeatureFolders.splice(featureFolderIndex, 1);
    } else {
      sharedFolderIndex = sharedFolders.findIndex((ff) => isUnderPath(ff, currentFilePath));
    }

    return {
      ImportDeclaration: function (node) {
        // Current file is neither a feature or shared folder -> nothing to do
        if (featureFolderIndex === -1 && sharedFolderIndex === -1) {
          return;
        }

        const importPath = path.parse(node.source.value).dir;

        // Only relative imports are supported
        if (!importPath.startsWith('.')) {
          return;
        }

        const importAbsolutePath = path.resolve(basePath, currentFilePath, importPath);
        const featureFolderImportedIndex = otherFeatureFolders.findIndex((ff) => isUnderPath(ff, importAbsolutePath));

        if (featureFolderImportedIndex !== -1) {
          return context.report(
            buildReport(
              node,
              featureFolderIndex !== -1 ? featureFolders[featureFolderIndex] : sharedFolders[sharedFolderIndex],
              otherFeatureFolders[featureFolderImportedIndex],
            ),
          );
        }
      },
    };
  },
};
