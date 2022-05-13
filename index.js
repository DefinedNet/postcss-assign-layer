const { createFilter } = require("@rollup/pluginutils");

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = ({
  include = "**/*.module.css",
  layerName = "components",
} = {}) => {
  const filter = createFilter(include);

  return {
    postcssPlugin: "postcss-assign-layers",
    async Once(root, { AtRule }) {
      const inputFile = root.source.input.file;
      if (!filter(inputFile)) return;

      const layer = new AtRule({
        name: "layer",
        params: layerName,
        nodes: root.nodes,
      });
      root.removeAll();
      root.append(layer);
    },
  };
};

module.exports.postcss = true;
