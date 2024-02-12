const { createFilter } = require("@rollup/pluginutils");

const DEFAULT_INCLUDE = "**/*.module.css";
const DEFAULT_LAYERNAME = "components";

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (
  configItems = [
    {
      include: DEFAULT_INCLUDE,
      layerName: DEFAULT_LAYERNAME,
    },
  ]
) => {
  const filters = [];

  for (const config of configItems) {
    const filter = createFilter(config.include ?? DEFAULT_INCLUDE);
    filters.push({ filter, layerName: config.layerName ?? DEFAULT_LAYERNAME });
  }

  return {
    postcssPlugin: "postcss-assign-layers",
    async Once(root, { AtRule }) {
      const inputFile = root.source.input.file;
      const layerNames = [];

      for (const { filter, layerName } of filters) {
        if (filter(inputFile)) {
          layerNames.push(layerName);
        }
      }

      for (const layerName of layerNames) {
        const layer = new AtRule({
          name: "layer",
          params: layerName,
          nodes: root.nodes,
        });
        root.removeAll();
        root.append(layer);
      }
    },
  };
};

module.exports.postcss = true;
