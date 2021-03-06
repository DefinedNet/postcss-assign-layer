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
  it("adds component layer to entire *.module.css file by default", async () => {
    const filePath = path.resolve("test/fixtures/component.module.css");
    const file = readFileSync(filePath, "utf-8");
    await run(
      file,
      `@layer components {
        a {
          color: BurlyWood;
        }

        i {
          color: WhiteSmoke;
        }
      }`,
      undefined,
      {
        from: filePath,
      }
    );
  });

  it("allows customizing the layer name layer to module.css files by default", async () => {
    const filePath = path.resolve("test/fixtures/component.module.css");
    const file = readFileSync(filePath, "utf-8");
    await run(
      file,
      `@layer custom {
        a {
          color: BurlyWood;
        }

        i {
          color: WhiteSmoke;
        }
      }`,
      { layerName: "custom" },
      {
        from: filePath,
      }
    );
  });

  it("does not apply to non-module css files by default", async () => {
    const filePath = path.resolve("test/fixtures/base.css");
    const file = readFileSync(filePath, "utf-8");
    await run(
      file,
      `a {
        color: FireBrick;
      }`,
      undefined,
      {
        from: filePath,
      }
    );
  });

  it("allows specifying files with include pattern", async () => {
    const filePath = path.resolve("test/fixtures/base.css");
    const file = readFileSync(filePath, "utf-8");
    await run(
      file,
      `@layer components {
        a {
          color: FireBrick;
        }
      }`,
      {
        include: "**/base.css",
      },
      {
        from: filePath,
      }
    );
  });

  it("does not process module file if other include pattern is provided", async () => {
    const filePath = path.resolve("test/fixtures/component.module.css");
    const file = readFileSync(filePath, "utf-8");
    await run(
      file,
      `a {
        color: BurlyWood;
      }

      i {
        color: WhiteSmoke;
      }`,
      {
        include: "**/base.css",
      },
      {
        from: filePath,
      }
    );
  });
});
