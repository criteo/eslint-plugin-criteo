/**
 * @fileoverview until-destroy
 * @author Xavier Dupessey
 */
'use strict';

const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#until-destroy`;

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Use UntilDestroy properly',
      recommended: 'error',
    },
    messages: {
      missingDecorator: `Decorate the classes using untilDestroyed with @UntilDestroy(). ${moreInfo}`,
      unecessaryDecorator: `Classes not using untilDestroyed do not need @UntilDestroy(). ${moreInfo}`,
    },
    schema: [],
  },

  create(context) {
    function checkNode(node) {
      const importSource = node.source.value.trim();

      if (importSource !== '@ngneat/until-destroy') {
        return;
      }

      const imported = node.specifiers.map((s) => s.imported.name);

      if (imported.includes('untilDestroyed') && !imported.includes('UntilDestroy')) {
        return context.report({ messageId: 'missingDecorator', node });
      }

      // It makes sense to import only "UntilDestroy" in utests to be able to decorate classes manually
      const isTestFile = context.getFilename().includes('.spec.');

      if (!isTestFile && !imported.includes('untilDestroyed') && imported.includes('UntilDestroy')) {
        return context.report({ messageId: 'unecessaryDecorator', node });
      }
    }

    return {
      ImportDeclaration: checkNode,
    };
  },
};
