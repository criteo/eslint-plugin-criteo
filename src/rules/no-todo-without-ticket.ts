import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#no-todo-without-ticket';

type MessageIds = 'ticket_required';
type Options = [];
type Docs = { recommended: 'error' };

function containsTodo(text: string): boolean {
  return /\b(todo|fixme)\b/im.test(text);
}

function containsJiraKey(text: string): boolean {
  return /\b([A-Z][A-Z0-9]+-[0-9]+)\b/m.test(text);
}

function isEslintDirective(text: string): boolean {
  return /^\s*eslint-(?:disable(?:-next-line|-line)?|enable)\b/.test(text);
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'problem',
    docs: {
      recommended: 'error',
      description: 'Comments containing TODO or FIXME must reference a JIRA ticket. (e.g. ABC-1234)',
    },
    messages: {
      ticket_required: `Comments containing TODO or FIXME must reference a JIRA ticket. (e.g. ABC-1234). ${moreInfo}`,
    },
    schema: [],
  },
  create(context) {
    const validateComment = (comment: TSESTree.Comment): void => {
      const text = comment.value;
      if (isEslintDirective(text) || !containsTodo(text) || containsJiraKey(text)) {
        return;
      }

      context.report({
        messageId: 'ticket_required',
        loc: comment.loc,
      });
    };

    return {
      Program(): void {
        context.sourceCode.getAllComments().forEach(validateComment);
      },
    };
  },
};

export default rule;
