import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { STYLE_URL_SELECTOR, STYLE_URLS_SELECTOR, STYLES_SELECTOR } from '../utils.js';

const moreInfo = 'More info: https://github.com/criteo/eslint-plugin-criteo#ngx-no-styles-in-component';

type MessageIds = 'styles';
type Options = [];
type Docs = { recommended: 'error' };

const rule: TSESLint.RuleModule<MessageIds, Options, Docs> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use the design system for styles instead of adding CSS to a component',
      recommended: 'error',
    },
    messages: {
      styles: `Where possible, prefer components and CSS classes from the design system library. ${moreInfo}`,
    },
    schema: [],
  },
  create(context) {
    const report = (node: TSESTree.Node): void => {
      context.report({ node, messageId: 'styles' });
    };

    return {
      [STYLES_SELECTOR]: report,
      [STYLE_URL_SELECTOR]: report,
      [STYLE_URLS_SELECTOR]: report,
    };
  },
};

export default rule;
