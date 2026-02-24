import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#no-indexed-access-on-enums';

type MessageIds = 'failure';
type Options = [];
type Docs = { recommended: 'error' };

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Do not use indexed access on enums',
      recommended: 'error',
    },
    messages: {
      failure: `Indexed accesses on an enum are almost always a mistake, as the names of the enum values should not be "data" in the context of the application at runtime. ${moreInfo}`,
    },
    schema: [],
  },
  create(context) {
    const checkMemberExpression = (node: TSESTree.MemberExpression): void => {
      if (!node.computed) {
        return;
      }

      const parserServices = context.sourceCode.parserServices;
      if (!parserServices?.program || typeof parserServices.getSymbolAtLocation !== 'function') {
        return;
      }

      const symbol = parserServices.getSymbolAtLocation(node.object);
      if (!symbol) {
        return;
      }

      const checker = parserServices.program.getTypeChecker();
      const resolvedSymbol = (symbol.flags & ts.SymbolFlags.Alias) !== 0 ? checker.getAliasedSymbol(symbol) : symbol;

      if ((resolvedSymbol.flags & ts.SymbolFlags.Enum) === 0) {
        return;
      }

      context.report({
        node,
        messageId: 'failure',
      });
    };

    return {
      MemberExpression: checkMemberExpression,
    };
  },
};

export default rule;
