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
plugin.postcss = true;

export default plugin;
