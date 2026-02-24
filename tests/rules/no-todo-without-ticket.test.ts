import rule from '../../src/rules/no-todo-without-ticket.js';
import { untypedRuleTester } from '../rule-tester.js';

untypedRuleTester.run('no-todo-without-ticket', rule, {
  valid: [
    `const x = 1;`,
    `// This is a regular comment`,
    `// TODO: RMFP-1234 fix this`,
    `// FIXME: ABC-567 needs refactoring`,
    `/* TODO: PROJ-123 implement this */`,
    `
    /**
     * TODO: RMFP-999 implement this feature
     */
    `,
    `// TODO ABC-1 do something`,
    // eslint directive comments contain "todo" in the rule name — should not trigger
    `
    // eslint-disable-next-line @rule-tester/no-todo-without-ticket
    // TODO: fix this
    `,
    `/* TODO fix this */ // eslint-disable-line @rule-tester/no-todo-without-ticket`,
    `
    /* eslint-disable @rule-tester/no-todo-without-ticket */
    // TODO: fix this
    `,
    `
    /* eslint-disable @rule-tester/no-todo-without-ticket */
    // TODO: fix this
    /* eslint-enable @rule-tester/no-todo-without-ticket */
    `,
  ],
  invalid: [
    {
      code: `// TODO: fix this later`,
      errors: [{ messageId: 'ticket_required' }],
    },
    {
      code: `// FIXME: broken`,
      errors: [{ messageId: 'ticket_required' }],
    },
    {
      code: `/* TODO: implement */`,
      errors: [{ messageId: 'ticket_required' }],
    },
    {
      code: `// todo fix this`,
      errors: [{ messageId: 'ticket_required' }],
    },
    {
      code: `
      // TODO: first thing
      // TODO: second thing
      `,
      errors: [{ messageId: 'ticket_required' }, { messageId: 'ticket_required' }],
    },
    {
      code: `// Fixme: update this`,
      errors: [{ messageId: 'ticket_required' }],
    },
    {
      code: `
      /**
       * TODO: implement this feature
       */
      `,
      errors: [{ messageId: 'ticket_required' }],
    },
  ],
});
