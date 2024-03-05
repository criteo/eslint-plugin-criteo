function metadataProperty(key) {
  return `Property:matches([key.name=${key}][computed=false], [key.value=${key}], [key.quasis.0.value.raw=${key}])`;
}

const COMPONENT_SELECTOR = 'ClassDeclaration > Decorator[expression.callee.name="Component"]';

function componentMetaDataProperty(key) {
  return `${COMPONENT_SELECTOR} > CallExpression > ObjectExpression > ${metadataProperty(key)}`;
}

module.exports = {
  COMPONENT_SELECTOR,
  STYLES_SELECTOR: componentMetaDataProperty('styles'),
  STYLE_URL_SELECTOR: componentMetaDataProperty('styleUrl'),
  STYLE_URLS_SELECTOR: componentMetaDataProperty('styleUrls'),
  TEMPLATE_URL_SELECTOR: componentMetaDataProperty('templateUrl'),
};
