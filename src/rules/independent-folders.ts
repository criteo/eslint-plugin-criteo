import path from 'node:path';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#independent-folders';

type MessageIds = 'error';
type Docs = { recommended: 'error' };
type RuleOptions = {
  basePath?: string;
  featureFolders?: string[];
  sharedFolders?: string[];
};
type Options = [RuleOptions?];

function isUnderPath(folderPath: string, targetPath: string): boolean {
  const relative = path.relative(folderPath, targetPath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function buildReport(
  node: TSESTree.ImportDeclaration,
  currentFolder: string,
  importedFolder: string,
): TSESLint.ReportDescriptor<MessageIds> {
  return {
    data: {
      currentFolder: path.parse(currentFolder).base,
      import: String(node.source.value),
      importedFolder: path.parse(importedFolder).base,
    },
    messageId: 'error',
    node,
  };
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Feature folders should be independent and not import form each others',
      recommended: 'error',
    },
    messages: {
      error: `Forbidden import '{{ currentFolder }}' <- '{{ importedFolder }}', do not use '{{ import }}'. ${moreInfo}`,
    },
    defaultOptions: [{}],
    schema: [
      {
        description: 'Folder layout configuration used to detect forbidden cross-feature imports.',
        type: 'object',
        properties: {
          basePath: {
            type: 'string',
            description: 'Base directory used to resolve feature and shared folder entries.',
          },
          featureFolders: {
            type: 'array',
            description: 'Feature folders that must remain independent from each other.',
            items: {
              type: 'string',
              description: 'A folder path relative to basePath.',
            },
          },
          sharedFolders: {
            type: 'array',
            description: 'Folders allowed to import from feature folders without violations.',
            items: {
              type: 'string',
              description: 'A folder path relative to basePath.',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0];
    const basePath = path.resolve(process.cwd(), options?.basePath ?? './');
    const featureFolders = (options?.featureFolders ?? [])
      .filter((folder): folder is string => typeof folder === 'string')
      .map((folder) => path.resolve(basePath, folder));
    const sharedFolders = (options?.sharedFolders ?? [])
      .filter((folder): folder is string => typeof folder === 'string')
      .map((folder) => path.resolve(basePath, folder));

    const currentFilePath = path.dirname(context.filename);
    const featureFolderIndex = featureFolders.findIndex((folder) => isUnderPath(folder, currentFilePath));
    const sharedFolderIndex =
      featureFolderIndex === -1 ? sharedFolders.findIndex((folder) => isUnderPath(folder, currentFilePath)) : -1;

    const otherFeatureFolders =
      featureFolderIndex === -1 ? featureFolders : featureFolders.filter((_, index) => index !== featureFolderIndex);

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration): void {
        if (featureFolderIndex === -1 && sharedFolderIndex === -1) {
          return;
        }

        if (typeof node.source.value !== 'string' || !node.source.value.startsWith('.')) {
          return;
        }

        const importAbsolutePath = path.resolve(currentFilePath, node.source.value);
        const importedFeatureFolderIndex = otherFeatureFolders.findIndex((folder) =>
          isUnderPath(folder, importAbsolutePath),
        );

        if (importedFeatureFolderIndex === -1) {
          return;
        }

        const currentFolder =
          featureFolderIndex !== -1 ? featureFolders[featureFolderIndex] : sharedFolders[sharedFolderIndex];
        const importedFolder = otherFeatureFolders[importedFeatureFolderIndex];

        if (!currentFolder || !importedFolder) {
          return;
        }

        context.report(buildReport(node, currentFolder, importedFolder));
      },
    };
  },
};

export default rule;
