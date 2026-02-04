import rule from '../../src/rules/cypress-no-force.js';
import { typedRuleTester, untypedRuleTester } from '../rule-tester.js';

const cypressPrelude = `
  declare namespace Cypress {
    interface Chainable {
      click(options?: { force?: boolean }): Chainable;
      dblclick(options?: { force?: boolean }): Chainable;
      type(value: string, options?: { force?: boolean }): Chainable;
      trigger(event: string, options?: { force?: boolean }): Chainable;
      check(options?: { force?: boolean }): Chainable;
      rightclick(options?: { force?: boolean }): Chainable;
      focus(options?: { force?: boolean }): Chainable;
      select(value: string, options?: { force?: boolean }): Chainable;
      contains(value: string, options?: { force?: boolean }): Chainable;
      get(selector: string): Chainable;
    }
  }

  declare const cy: Cypress.Chainable;
`;

untypedRuleTester.run('cypress-no-force (untyped)', rule, {
  valid: [
    // Should not crash when type-services are not available.
    'const element = { click: (_options?: { force?: boolean }) => {} }; element.click({ force: true });',
  ],
  invalid: [],
});

typedRuleTester.run('cypress-no-force', rule, {
  valid: [
    {
      code: `${cypressPrelude} cy.click();`,
    },
    {
      code: `${cypressPrelude} cy.click({ force: false });`,
    },
    {
      code: `${cypressPrelude} cy.contains('cta', { force: true });`,
    },
    {
      code: `${cypressPrelude} const element = { click: (_options?: { force?: boolean }) => {} }; element.click({ force: true });`,
    },
  ],
  invalid: [
    {
      code: `${cypressPrelude} cy.click({ force: true });`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `${cypressPrelude} cy['click']({ force: true });`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `${cypressPrelude} cy.dblclick({ force: true });`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `${cypressPrelude} cy.trigger('mouseover', { force: true });`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `${cypressPrelude} cy.check({ force: true });`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `${cypressPrelude} cy.rightclick({ force: true });`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `${cypressPrelude} cy.focus({ force: true });`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `${cypressPrelude} cy.get('#a').type('hello', { force: true });`,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `${cypressPrelude} cy.select('value', { 'force': true });`,
      errors: [{ messageId: 'unexpected' }],
    },
  ],
});
