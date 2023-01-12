import { build } from "esbuild";
import replace from "replace-in-file";
const contracts = ["/contract.ts"];

build({
  entryPoints: contracts.map((source) => {
    return `./contract/${source}`;
  }),
  outdir: "./dist",
  minify: false,
  bundle: true,
  format: "iife",
})
  .catch(() => process.exit(1))
  .finally(() => {
    const files = contracts.map((source) => {
      return `./dist${source}`.replace(".ts", ".js");
    });
    replace.sync({
      files: files,
      from: [/\(\(\) => {/g, /}\)\(\);/g],
      to: "",
      countMatches: true,
    });
  });
