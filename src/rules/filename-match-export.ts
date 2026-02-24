import path from 'node:path';
import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

const clean = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '');
const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#filename-match-export';

type MessageIds = 'error';
type Docs = { recommended: 'error' };
type RuleOptions = { removeFromFilename?: string[] };
type Options = [RuleOptions?];

function toModuleExportName(name: TSESTree.Identifier | TSESTree.Literal): string | undefined {
  if (name.type === AST_NODE_TYPES.Identifier) {
    return name.name;
  }

  return typeof name.value === 'string' ? name.value : undefined;
}

function getNamedExports(node: TSESTree.ExportNamedDeclaration): string[] {
  if (node.declaration) {
    if ('id' in node.declaration && node.declaration.id?.type === AST_NODE_TYPES.Identifier) {
      return [node.declaration.id.name];
    }

    if (node.declaration.type === AST_NODE_TYPES.VariableDeclaration) {
      return node.declaration.declarations
        .map((declaration) => declaration.id)
        .filter((id): id is TSESTree.Identifier => id.type === AST_NODE_TYPES.Identifier)
        .map((id) => id.name);
    }
  }

  return node.specifiers
    .filter((specifier): specifier is TSESTree.ExportSpecifier => specifier.type === AST_NODE_TYPES.ExportSpecifier)
    .map((specifier) => toModuleExportName(specifier.exported))
    .filter((name): name is string => typeof name === 'string' && name.length > 0);
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'File name should match exported member',
      recommended: 'error',
    },
    messages: {
      error: `Filename "{{ filename }}" does not match any of "{{ exported }}". ${moreInfo}`,
    },
    defaultOptions: [{}],
    schema: [
      {
        description: 'Optional configuration for filename normalization before matching exported names.',
        type: 'object',
        properties: {
          removeFromFilename: {
            type: 'array',
            description: 'Strings removed from the filename before comparing it against exported identifiers.',
            items: {
              type: 'string',
              description: 'A literal substring to remove from the filename.',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0];
    const removeFromFilename = (options?.removeFromFilename ?? []).filter(
      (value): value is string => typeof value === 'string',
    );

    const exported = new Set<string>();
    const exportedClean = new Set<string>();

    return {
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration): void {
        for (const exportName of getNamedExports(node)) {
          exported.add(exportName);
          exportedClean.add(clean(exportName));
        }
      },
      'Program:exit'(node: TSESTree.Program): void {
        if (exported.size === 0) {
          return;
        }

        const filename = path.parse(context.filename);
        let normalizedFilename = filename.name;
        for (const remove of removeFromFilename) {
          normalizedFilename = normalizedFilename.replace(remove, '');
        }

        if (!exportedClean.has(clean(normalizedFilename))) {
          context.report({
            data: { filename: filename.base, exported: Array.from(exported).join('" | "') },
            messageId: 'error',
            node,
          });
        }
      },
    };
  },
};

export default rule;
