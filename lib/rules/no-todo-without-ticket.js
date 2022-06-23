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
      return !!text.match(/(^|\s|\/|\/\*)todo([:\s]|$|\*)/gmi);
    }

    function containsJiraKey(text){
      return !!text.match(/(^|\s|\/|\/\*)([A-Z][A-Z0-9]+-[0-9]+)([:\s]|$|\*)/gm);
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
