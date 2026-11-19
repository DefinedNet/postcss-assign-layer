import { createFilter } from "@rollup/pluginutils";
import type { PluginCreator } from "postcss";

const DEFAULT_INCLUDE = "**/*.module.css";
const DEFAULT_LAYERNAME = "components";

type ConfigItem = {
  include?: string;
  layerName?: string;
};
export type PluginOptions = ConfigItem[];

const plugin: PluginCreator<PluginOptions> = (
  configItems = [
    {
      include: DEFAULT_INCLUDE,
      layerName: DEFAULT_LAYERNAME,
    },
  ]
) => {
  const filters: { filter: (id: string) => boolean; layerName: string }[] = [];

  for (const config of configItems) {
    const filter = createFilter(config.include ?? DEFAULT_INCLUDE);
    filters.push({ filter, layerName: config.layerName ?? DEFAULT_LAYERNAME });
  }

  return {
    postcssPlugin: "postcss-assign-layers",
    Once(root, { AtRule }) {
      const inputFile = root.source?.input.file;
      const layerNames = [];

      for (const { filter, layerName } of filters) {
        if (inputFile && filter(inputFile)) {
          layerNames.push(layerName);
        }
      }

      if (layerNames.length === 0) return;

      // `@charset` must be the first thing in a stylesheet, `@namespace` is only valid at
      // the top level, and css-loader only reads ICSS `:import`/`:export` rules at the
      // root, so these stay outside the layer.
      const rootOnly = root.nodes.filter(
        (node) =>
          (node.type === "atrule" &&
            (node.name === "charset" || node.name === "namespace")) ||
          (node.type === "rule" && /^:(import|export)\b/.test(node.selector))
      );
      for (const node of rootOnly) node.remove();
      // Browsers only honor `@charset` as the very first bytes of the file.
      if (rootOnly[0]) rootOnly[0].raws.before = "";

      for (const layerName of layerNames) {
        const layer = new AtRule({
          name: "layer",
          params: layerName,
          nodes: root.nodes,
        });
        root.removeAll();
        root.append(layer);
      }

      root.prepend(rootOnly);
    },
  };
};
plugin.postcss = true;

export default plugin;
