import postcss from "postcss";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const plugin = (await import(".")).default;

async function run(input, output, opts = {}, postcssOpts = {}) {
  let result = await postcss([plugin(opts)]).process(input, postcssOpts);
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

describe("postcss-assign-layer", () => {
  it("does the thing", async () => {
    const filePath = path.resolve("test/fixtures/component.module.css");
    const file = readFileSync(filePath, "utf-8");

    await run(
      file,
      "@layer components {a {\n  color: BurlyWood;\n}\n}\n",
      {},
      {
        from: filePath,
      }
    );
  });
});
