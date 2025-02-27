/**
 * @fileoverview no-indexed-access-on-enums
 * @author Connor Ullman
 * @author Adam Perea
 */
'use strict';

import ts from 'typescript';
const moreInfo = `More info: https://github.com/criteo/eslint-plugin-criteo#no-indexed-access-on-enums`;

export default {
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
    return {
      MemberExpression(node) {
        const parserServices = context.sourceCode.parserServices;
        if (!parserServices) return;

        const checker = parserServices.program?.getTypeChecker();
        if (!checker) return;

        if (!node.computed) return;

        const objectNode = parserServices.esTreeNodeToTSNodeMap.get(node.object);
        const objectSymbol = checker.getSymbolAtLocation(objectNode);
        if (!objectSymbol) return;

        const enumSymbol =
          ts.SymbolFlags.Alias & objectSymbol.flags ? checker.getAliasedSymbol(objectSymbol) : objectSymbol;
        const isEnum = ts.SymbolFlags.Enum & enumSymbol.flags;
        if (!isEnum) return;

        context.report({
          node,
          messageId: 'failure',
        });
      },
    };
  },
};
