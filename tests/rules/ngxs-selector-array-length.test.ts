import rule from '../../src/rules/ngxs-selector-array-length.js';
import { untypedRuleTester } from '../rule-tester.js';

untypedRuleTester.run('ngxs-selector-array-length', rule, {
  valid: [
    {
      code: 'class TestState { mySelector(a) { return a; } }',
    },
    {
      code: 'class TestState { @Selector() static mySelector(a) { return a; } }',
    },
    {
      code: 'class TestState { @Selector([StateA, StateB]) static mySelector(a, b) { return [a, b]; } }',
    },
    {
      // Non-call decorator syntax should be ignored safely.
      code: 'class TestState { @Selector static mySelector(a) { return a; } }',
    },
    {
      // Non-array first argument should be ignored safely.
      code: 'class TestState { @Selector(StateA) static mySelector(a) { return a; } }',
    },
  ],
  invalid: [
    {
      code: 'class TestState { @Selector([StateA, StateB]) static mySelector(a) { return a; } }',
      errors: [{ messageId: 'mismatch' }],
    },
    {
      code: 'class TestState { @Selector([StateA]) static mySelector() { return 1; } }',
      errors: [{ messageId: 'mismatch' }],
    },
  ],
});
