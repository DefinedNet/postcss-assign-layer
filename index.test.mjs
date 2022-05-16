import { readFileSync } from "node:fs";
import path from "node:path";
import postcss from "postcss";
import prettier from "prettier";
import { describe, it, expect } from "vitest";

const plugin = (await import(".")).default;

// We don't care about formatting differences, so normalize with prettier
function format(css) {
  return prettier.format(css, { parser: "css" });
}

async function run(input, output, opts, postcssOpts = {}) {
  let result = await postcss([plugin(opts)]).process(input, postcssOpts);
  expect(format(result.css)).toEqual(format(output));
  expect(result.warnings()).toHaveLength(0);
}

describe("postcss-assign-layer", () => {
  it("adds component layer to module.css files by default", async () => {
    const filePath = path.resolve("test/fixtures/component.module.css");
    const file = readFileSync(filePath, "utf-8");

    await run(
      file,
      "@layer components { a { color: BurlyWood; } }",
      undefined,
      {
        from: filePath,
      }
    );
  });
});
