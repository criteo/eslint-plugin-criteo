import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#no-spreading-accumulators';

type MessageIds = 'objectMessage' | 'arrayMessage';
type Options = [];
type Docs = { recommended: 'error' };

function isAccumulatorSpreadElement(
  node: TSESTree.Node | null | undefined,
  accumulatorName: string,
): node is TSESTree.SpreadElement {
  return (
    node?.type === AST_NODE_TYPES.SpreadElement &&
    node.argument.type === AST_NODE_TYPES.Identifier &&
    node.argument.name === accumulatorName
  );
}

function getObjectPropertyAssignment(
  property: TSESTree.Property,
  accumulatorName: string,
  sourceCode: TSESLint.SourceCode,
): string | undefined {
  if (property.kind !== 'init' || property.method) {
    return undefined;
  }

  const valueText = sourceCode.getText(property.value);
  if (property.computed) {
    return `${accumulatorName}[${sourceCode.getText(property.key)}] = ${valueText}`;
  }

  if (property.key.type === AST_NODE_TYPES.Identifier) {
    return `${accumulatorName}.${property.key.name} = ${valueText}`;
  }

  if (property.key.type === AST_NODE_TYPES.Literal && typeof property.key.value === 'string') {
    return `${accumulatorName}[${JSON.stringify(property.key.value)}] = ${valueText}`;
  }

  return `${accumulatorName}[${sourceCode.getText(property.key)}] = ${valueText}`;
}

function getObjectFix(
  arrowFunction: TSESTree.ArrowFunctionExpression,
  accumulatorName: string,
  spreadIndex: number,
  expression: TSESTree.ObjectExpression,
  sourceCode: TSESLint.SourceCode,
  hasOnlyAccumulatorSpreads: boolean,
): TSESLint.ReportFixFunction | null {
  if (!hasOnlyAccumulatorSpreads || spreadIndex !== 0 || arrowFunction.params.length <= 1) {
    return null;
  }

  const assignments = expression.properties
    .filter((property, index) => index !== spreadIndex)
    .map((property) => {
      if (property.type !== AST_NODE_TYPES.Property) {
        return undefined;
      }

      return getObjectPropertyAssignment(property, accumulatorName, sourceCode);
    })
    .filter((assignment): assignment is string => typeof assignment === 'string');

  if (assignments.length === 0) {
    return null;
  }

  const paramsText = arrowFunction.params.map((param) => sourceCode.getText(param)).join(', ');
  const bodyText = `${assignments.join('; ')}; return ${accumulatorName};`;
  const newArrowFunctionText = `(${paramsText}) => { ${bodyText} }`;
  return (fixer) => fixer.replaceText(arrowFunction, newArrowFunctionText);
}

function getArrayFix(
  arrowFunction: TSESTree.ArrowFunctionExpression,
  accumulatorName: string,
  spreadIndex: number,
  expression: TSESTree.ArrayExpression,
  sourceCode: TSESLint.SourceCode,
  hasOnlyAccumulatorSpreads: boolean,
): TSESLint.ReportFixFunction | null {
  if (!hasOnlyAccumulatorSpreads || spreadIndex !== 0 || arrowFunction.params.length <= 1) {
    return null;
  }

  const values: string[] = [];
  expression.elements.forEach((element, index) => {
    if (index === spreadIndex || element === null) {
      return;
    }

    values.push(sourceCode.getText(element));
  });
  if (values.length === 0) {
    return null;
  }

  const paramsText = arrowFunction.params.map((param) => sourceCode.getText(param)).join(', ');
  const bodyText = `${accumulatorName}.push(${values.join(', ')}); return ${accumulatorName};`;
  const newArrowFunctionText = `(${paramsText}) => { ${bodyText} }`;
  return (fixer) => fixer.replaceText(arrowFunction, newArrowFunctionText);
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: {
      objectMessage: `Creating a new object by spreading the previous accumulator at every iteration of a .reduce() call has O(n^2) time & spatial complexity. If possible, make this O(n) by assigning to the existing accumulator or use mappedBy() or mappedByUnique() instead of .reduce(). ${moreInfo}`,
      arrayMessage: `Creating a new array by spreading the previous accumulator at every iteration of a .reduce() call has O(n^2) time & spatial complexity. If possible, make this O(n) by pushing to the existing accumulator instead. ${moreInfo}`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      'CallExpression:has([callee.property.name=reduce])[arguments] > ArrowFunctionExpression'(
        node: TSESTree.ArrowFunctionExpression,
      ): void {
        if (node.params[0]?.type !== AST_NODE_TYPES.Identifier) {
          return;
        }

        const accumulatorName = node.params[0].name;
        const expression = node.body;
        if (expression.type === AST_NODE_TYPES.ObjectExpression) {
          const spreadElements = expression.properties.filter(
            (property): property is TSESTree.SpreadElement => property.type === AST_NODE_TYPES.SpreadElement,
          );
          const spreadIndex = expression.properties.findIndex((property) =>
            isAccumulatorSpreadElement(property, accumulatorName),
          );
          if (spreadIndex === -1) {
            return;
          }

          const reportNode = expression.properties[spreadIndex];
          if (!reportNode || !isAccumulatorSpreadElement(reportNode, accumulatorName)) {
            return;
          }

          const hasOnlyAccumulatorSpreads = spreadElements.every((spreadElement) =>
            isAccumulatorSpreadElement(spreadElement, accumulatorName),
          );
          const fix = getObjectFix(
            node,
            accumulatorName,
            spreadIndex,
            expression,
            sourceCode,
            hasOnlyAccumulatorSpreads,
          );

          context.report({
            node: reportNode.argument,
            messageId: 'objectMessage',
            fix: fix ?? undefined,
          });
          return;
        }

        if (expression.type === AST_NODE_TYPES.ArrayExpression) {
          const spreadElements = expression.elements.filter(
            (element): element is TSESTree.SpreadElement => element?.type === AST_NODE_TYPES.SpreadElement,
          );
          const spreadIndex = expression.elements.findIndex((element) =>
            isAccumulatorSpreadElement(element, accumulatorName),
          );
          if (spreadIndex === -1) {
            return;
          }

          const reportNode = expression.elements[spreadIndex];
          if (!reportNode || !isAccumulatorSpreadElement(reportNode, accumulatorName)) {
            return;
          }

          const hasOnlyAccumulatorSpreads = spreadElements.every((spreadElement) =>
            isAccumulatorSpreadElement(spreadElement, accumulatorName),
          );
          const fix = getArrayFix(
            node,
            accumulatorName,
            spreadIndex,
            expression,
            sourceCode,
            hasOnlyAccumulatorSpreads,
          );

          context.report({
            node: reportNode.argument,
            messageId: 'arrayMessage',
            fix: fix ?? undefined,
          });
        }
      },
    };
  },
};

export default rule;
