import rule from '../../src/rules/no-indexed-access-on-enums.js';
import { typedRuleTester, untypedRuleTester } from '../rule-tester.js';

untypedRuleTester.run('no-indexed-access-on-enums (untyped)', rule, {
  valid: [
    // Ensures the rule is a no-op when parserServices are unavailable.
    "const map = { A: 0 }; const value = map['A'];",
  ],
  invalid: [],
});

typedRuleTester.run('no-indexed-access-on-enums', rule, {
  valid: [
    // Non-computed enum member access should be ignored.
    'enum Status { Ok, Ko } const value = Status.Ok;',
    // Computed access on non-enum symbols should be ignored.
    "const map = { Ok: 1 }; const value = map['Ok'];",
    // Computed access where no symbol exists on the object should be ignored.
    "const value = ({ Ok: 1 })['Ok'];",
  ],
  invalid: [
    {
      code: 'enum Status { Ok, Ko } const value = Status[0];',
      errors: [{ messageId: 'failure' }],
    },
    {
      code: "enum Status { Ok = 'OK' } const key = Status['Ok'];",
      errors: [{ messageId: 'failure' }],
    },
    {
      // TS import-equals creates an alias symbol; rule should still flag it.
      code: 'namespace Ns { export enum Status { Ok, Ko } } import StatusAlias = Ns.Status; const value = StatusAlias[0];',
      errors: [{ messageId: 'failure' }],
    },
  ],
});
