export function buildConfig(configs, override = {}) {
  if (!Array.isArray(configs)) {
    throw new Error('First argument of "buildConfig" must be an array instead of ' + JSON.stringify(configs));
  }

  return [configs].flat(Infinity).map((config) => {
    return { ...config, ...override };
  });
}

export const tsConfigBase = {
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
};

export function aliasPluginConfig(plugin, config, sourceName, alias) {
  const rules = Object.fromEntries(
    Object.entries(config.rules).map(([name, setting]) => [name.replace(`${sourceName}/`, `${alias}/`), setting]),
  );

  return {
    ...config,
    name: `criteo/${alias}/recommended`,
    plugins: { [alias]: plugin },
    rules,
  };
}

// Selectors

function metadataProperty(key) {
  return `Property:matches([key.name=${key}][computed=false], [key.value=${key}], [key.quasis.0.value.raw=${key}])`;
}

function componentMetaDataProperty(key) {
  return `${COMPONENT_SELECTOR} > CallExpression > ObjectExpression > ${metadataProperty(key)}`;
}

export const COMPONENT_SELECTOR = 'ClassDeclaration > Decorator[expression.callee.name="Component"]';

export const STYLES_SELECTOR = componentMetaDataProperty('styles');

export const STYLE_URL_SELECTOR = componentMetaDataProperty('styleUrl');

export const STYLE_URLS_SELECTOR = componentMetaDataProperty('styleUrls');

export const TEMPLATE_URL_SELECTOR = componentMetaDataProperty('templateUrl');
