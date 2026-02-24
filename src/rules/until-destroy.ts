import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#until-destroy';

type MessageIds = 'missingDecorator' | 'unnecessaryDecorator';
type Options = [];
type Docs = { recommended: 'error' };

function toImportedName(name: TSESTree.Identifier | TSESTree.Literal): string | undefined {
  if (name.type === AST_NODE_TYPES.Identifier) {
    return name.name;
  }

  return typeof name.value === 'string' ? name.value : undefined;
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Use UntilDestroy properly',
      recommended: 'error',
    },
    messages: {
      missingDecorator: `Decorate the classes using untilDestroyed with @UntilDestroy(). ${moreInfo}`,
      unnecessaryDecorator: `Classes not using untilDestroyed do not need @UntilDestroy(). ${moreInfo}`,
    },
    schema: [],
  },
  create(context) {
    const checkImport = (node: TSESTree.ImportDeclaration): void => {
      if (node.source.value !== '@ngneat/until-destroy') {
        return;
      }

      const importedNames = new Set<string>();
      for (const specifier of node.specifiers) {
        if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) {
          continue;
        }

        const importedName = toImportedName(specifier.imported);
        if (importedName) {
          importedNames.add(importedName);
        }
      }

      if (importedNames.has('untilDestroyed') && !importedNames.has('UntilDestroy')) {
        context.report({ messageId: 'missingDecorator', node });
        return;
      }

      const isTestFile = context.filename.includes('.spec.');
      if (!isTestFile && !importedNames.has('untilDestroyed') && importedNames.has('UntilDestroy')) {
        context.report({ messageId: 'unnecessaryDecorator', node });
      }
    };

    return {
      ImportDeclaration: checkImport,
    };
  },
};

export default rule;
