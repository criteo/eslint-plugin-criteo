import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#no-ngxs-select-decorator';

type MessageIds = 'default';
type Options = [];
type Docs = { recommended: 'error' };

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid @Select() decorator',
      recommended: 'error',
    },
    messages: {
      default: `@Select() decorator is forbidden, prefer @ViewSelectSnapshot() instead. ${moreInfo}`,
    },
    schema: [],
  },
  create(context) {
    const reportDecorator = (node: TSESTree.Decorator): void => {
      context.report({ messageId: 'default', node });
    };

    return {
      'ClassProperty > Decorator[expression.callee.name="Select"]': reportDecorator,
      'PropertyDefinition > Decorator[expression.callee.name="Select"]': reportDecorator,
      'ClassProperty > Decorator[expression.name="Select"]': reportDecorator,
      'PropertyDefinition > Decorator[expression.name="Select"]': reportDecorator,
    };
  },
};

export default rule;
