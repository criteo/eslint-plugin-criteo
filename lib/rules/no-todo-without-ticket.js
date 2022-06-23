/**
 * @fileoverview no-todo-without-ticket
 * @author Joe Pikowski
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      recommended: 'error',
      description:
        'Comments containing TODO must reference a JIRA ticket. (e.g. ABC-1234)',
    },
    messages: {
      ticket_required: `Comments containing TODO must reference a JIRA ticket. (e.g. ABC-1234)`,
    },

  },
  create: function(context) {

     function containsTodo(text){
      const regex = /\btodo\b/mi;
      return regex.test(text);
    }

    function containsJiraKey(text){
      const regex = /\b([A-Z][A-Z0-9]+-[0-9]+)\b/m;
      return regex.test(text);
    }

    function validateComment(comment){
      if (!containsTodo(comment.value)) return;

      if (!containsJiraKey(comment.value)){
        return context.report({
          data: {},
          messageId: 'ticket_required',
          node: null,
          loc: comment.loc,
        });
      }
    }

    return {
      Program() {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();
        comments.forEach(validateComment);
      }
    };
  }
};
