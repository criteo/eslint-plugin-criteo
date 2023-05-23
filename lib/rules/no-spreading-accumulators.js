/**
 * @fileoverview no-spreading-accumulators
 * @author Connor Ullman
 * @author Joe Pikowski
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    return {
      'CallExpression:has([callee.property.name=reduce])[arguments] > ArrowFunctionExpression'(node) {
        const objectMessage =
          'Creating a new object by spreading the previous accumulator at every iteration of a .reduce() call has O(n^2) time & spatial complexity. If possible, make this O(n) by assigning to the existing accumulator or use mappedBy() or mappedByUnique() instead of .reduce().';
        const arrayMessage =
          'Creating a new array by spreading the previous accumulator at every iteration of a .reduce() call has O(n^2) time & spatial complexity. If possible, make this O(n) by pushing to the existing accumulator instead.';

        // only fetch the source code if getNodeText is called, and only fetch it once if we do
        const sourceCode = {
          _source: null,
          getNodeText(node) {
            if (this._source == null) this._source = context.getSourceCode().text;
            return this._source.slice(node.range[0], node.range[1]);
          },
        };

        const getReportConfig = (spreadNode, fix, message) => ({
          node: spreadNode.argument,
          loc: spreadNode.loc,
          message,
          fix,
        });

        const isSpreadNode = spreadNode =>
          spreadNode &&
          (spreadNode.type === 'ExperimentalSpreadProperty' ||
            spreadNode.type === 'SpreadProperty' ||
            spreadNode.type === 'SpreadElement');

        const arrowFn = node;
        const arrowFnFirstArg = arrowFn.params[0];
        if (!arrowFnFirstArg) return;

        const arrowFnFirstArgName = arrowFnFirstArg.name;
        const expression = arrowFn.body;
        if (!expression) return;

        const shouldReport = spreadNode => {
          if (!isSpreadNode(spreadNode)) return false;

          const spreadName = spreadNode.argument.name;
          const isAccumulatorBeingSpread = spreadName === arrowFnFirstArgName;
          return isAccumulatorBeingSpread;
        };

        if (expression.type === 'ObjectExpression') {
          let spreadIndex = null;
          for (let i = 0; i < expression.properties.length; i++) {
            if (isSpreadNode(expression.properties[i])) {
              spreadIndex = i;
              break;
            }
          }
          if (spreadIndex == null) return;

          const spreadNode = expression.properties[spreadIndex];
          if (!shouldReport(spreadNode)) return;

          const getObjectFix = () => {
            // if the spread isn't the first argument of the expression, then you can only assign to the accumulator if the entry
            // isn't already present without potentially changing behavior of the reduce
            if (spreadIndex !== 0) return undefined;

            if (arrowFn.params <= 1) return undefined;

            const paramsText = arrowFn.params.map(o => sourceCode.getNodeText(o)).join(', ');
            const nonSpreadPropertyTexts = expression.properties
              .filter((o, i) => i != spreadIndex)
              .map(
                o => `${arrowFnFirstArgName}[${sourceCode.getNodeText(o.key)}] = ${sourceCode.getNodeText(o.value)}`
              );
            if (nonSpreadPropertyTexts.length <= 0) return undefined;

            const bodyText = `${nonSpreadPropertyTexts.join('; ')}; return ${arrowFnFirstArgName};`;
            const newArrowFnText = `(${paramsText}) => { ${bodyText} }`;
            const fix = fixer => [fixer.replaceTextRange(arrowFn.range, newArrowFnText)];
            return fix;
          };
          const reportConfig = getReportConfig(spreadNode, getObjectFix(), objectMessage);
          return context.report(reportConfig);
        } else if (expression.type === 'ArrayExpression') {
          let spreadIndex = null;
          for (let i = 0; i < expression.elements.length; i++) {
            if (isSpreadNode(expression.elements[i])) {
              spreadIndex = i;
              break;
            }
          }
          if (spreadIndex == null) return;

          const spreadNode = expression.elements[spreadIndex];
          if (!shouldReport(spreadNode)) return;

          const getArrayFix = () => {
            // if the spread isn't the first argument of the expression, then you can only assign to the accumulator if the entry
            // isn't already present without potentially changing behavior of the reduce
            if (spreadIndex !== 0) return undefined;

            if (arrowFn.params <= 1) return undefined;

            const paramsText = arrowFn.params.map(o => sourceCode.getNodeText(o)).join(', ');
            const nonSpreadElementTexts = expression.elements
              .filter((o, i) => i != spreadIndex)
              .map(o => sourceCode.getNodeText(o));
            if (!nonSpreadElementTexts || nonSpreadElementTexts.length <= 0) return undefined;

            const bodyText = `${arrowFnFirstArgName}.push(${nonSpreadElementTexts.join(
              ', '
            )}); return ${arrowFnFirstArgName};`;
            const newArrowFnText = `(${paramsText}) => { ${bodyText} }`;
            const fix = fixer => [fixer.replaceTextRange(arrowFn.range, newArrowFnText)];
            return fix;
          };
          const reportConfig = getReportConfig(spreadNode, getArrayFix(), arrayMessage);
          return context.report(reportConfig);
        }
      },
    };
  },
};