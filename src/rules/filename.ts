import path from 'node:path';
import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';
import { COMPONENT_SELECTOR, STYLE_URL_SELECTOR, STYLE_URLS_SELECTOR, TEMPLATE_URL_SELECTOR } from '../utils.js';

const VALID_NAME_REGEX = /^[a-z0-9.-]+$/;
const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#filename';

type MessageIds = 'invalidPattern' | 'inconsistent' | 'componentFolder';
type Docs = { recommended: 'error' };
type RuleOptions = { pattern?: string };
type Options = [RuleOptions?];

function getStaticString(node: TSESTree.Node | null | undefined): string | undefined {
  if (!node) {
    return undefined;
  }

  if (node.type === AST_NODE_TYPES.Literal && typeof node.value === 'string') {
    return node.value;
  }

  if (node.type === AST_NODE_TYPES.TemplateLiteral && node.expressions.length === 0 && node.quasis.length === 1) {
    const quasi = node.quasis[0];
    if (quasi) {
      return quasi.value.cooked ?? undefined;
    }
  }

  return undefined;
}

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'File names should be consistent',
      recommended: 'error',
    },
    messages: {
      invalidPattern: `File name "{{ filename }}" is invalid, it should match "{{ pattern }}". ${moreInfo}`,
      inconsistent: `File names "{{ expected }}" and "{{ received }}" should be consistent. ${moreInfo}`,
      componentFolder: `The component should be defined in a folder called "{{ dirname }}". ${moreInfo}`,
    },
    defaultOptions: [{}],
    schema: [
      {
        description: 'Optional configuration for filename validation.',
        type: 'object',
        properties: {
          pattern: {
            type: 'string',
            description: 'Regular expression source used to validate the current file name.',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0];
    const pattern = options?.pattern ? new RegExp(options.pattern) : VALID_NAME_REGEX;
    const filename = path.parse(context.filename);

    return {
      Program(node: TSESTree.Program): void {
        if (!pattern.test(filename.name)) {
          context.report({
            data: { filename: filename.base, pattern: pattern.toString() },
            messageId: 'invalidPattern',
            node,
          });
        }
      },
      [TEMPLATE_URL_SELECTOR](node: TSESTree.Property): void {
        const templatePath = getStaticString(node.value);
        if (!templatePath) {
          return;
        }

        const template = path.parse(templatePath);
        if (template.name !== filename.name) {
          context.report({
            data: { expected: filename.base, received: template.base },
            messageId: 'inconsistent',
            node,
          });
        }
      },
      [STYLE_URL_SELECTOR](node: TSESTree.Property): void {
        const stylePath = getStaticString(node.value);
        if (!stylePath) {
          return;
        }

        const styleUrl = path.parse(stylePath);
        if (styleUrl.name !== filename.name) {
          context.report({
            data: { expected: filename.base, received: styleUrl.base },
            messageId: 'inconsistent',
            node,
          });
        }
      },
      [STYLE_URLS_SELECTOR](node: TSESTree.Property): void {
        if (node.value.type !== AST_NODE_TYPES.ArrayExpression || node.value.elements.length === 0) {
          return;
        }

        const firstStyleElement = node.value.elements[0];
        if (!firstStyleElement) {
          return;
        }

        const stylePath = getStaticString(firstStyleElement);
        if (!stylePath) {
          return;
        }

        const styleUrl = path.parse(stylePath);
        if (styleUrl.name !== filename.name) {
          context.report({
            data: { expected: filename.base, received: styleUrl.base },
            messageId: 'inconsistent',
            node,
          });
        }
      },
      [COMPONENT_SELECTOR](node: TSESTree.Decorator): void {
        const componentDir = filename.dir.split(path.sep).at(-1) ?? '';
        const expectedDir = filename.name.replace('.component', '');

        if (componentDir !== expectedDir) {
          context.report({
            data: { dirname: expectedDir },
            messageId: 'componentFolder',
            node,
          });
        }
      },
    };
  },
};

export default rule;
