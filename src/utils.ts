export type ConfigObject = Record<string, unknown>;
export type PluginMap = Record<string, unknown>;

function isConfigObject(config: unknown): config is ConfigObject {
  return config !== null && typeof config === 'object' && !Array.isArray(config);
}

function flattenConfigs(configs: readonly unknown[]): ConfigObject[] {
  const flattened: ConfigObject[] = [];
  for (const config of configs) {
    if (Array.isArray(config)) {
      flattened.push(...flattenConfigs(config));
    } else if (isConfigObject(config)) {
      flattened.push(config);
    }
  }

  return flattened;
}

export function buildConfig(configs: readonly unknown[], override: ConfigObject = {}): ConfigObject[] {
  if (!Array.isArray(configs)) {
    throw new Error('First argument of "buildConfig" must be an array instead of ' + JSON.stringify(configs));
  }

  return flattenConfigs(configs).map((config) => ({ ...config, ...override }));
}

export const tsConfigBase = {
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
};

// Selectors

function metadataProperty(key: string): string {
  return `Property:matches([key.name=${key}][computed=false], [key.value=${key}], [key.quasis.0.value.raw=${key}])`;
}

function componentMetaDataProperty(key: string): string {
  return `${COMPONENT_SELECTOR} > CallExpression > ObjectExpression > ${metadataProperty(key)}`;
}

export const COMPONENT_SELECTOR = 'ClassDeclaration > Decorator[expression.callee.name="Component"]';

export const STYLES_SELECTOR = componentMetaDataProperty('styles');

export const STYLE_URL_SELECTOR = componentMetaDataProperty('styleUrl');

export const STYLE_URLS_SELECTOR = componentMetaDataProperty('styleUrls');

export const TEMPLATE_URL_SELECTOR = componentMetaDataProperty('templateUrl');
