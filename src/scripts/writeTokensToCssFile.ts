#!/usr/bin/env ts-node-script

import * as path from "path";
import { writeFileSync } from "fs";

import { DesignTokens } from "@classes/DesignTokens";

const inputPath = process.argv[process.argv.length - 1];

if (typeof inputPath === "string") {
  const relativePath = path.relative(__dirname, inputPath);

  try {
    import(relativePath).then((modules: { default: DesignTokens }) => {
      const tokens = modules.default;

      if (tokens instanceof DesignTokens) {
        const filename = path.basename(inputPath, "ts");
        const dirname = path.dirname(inputPath);

        const outputPath = path.resolve(dirname, filename + ".css");
        const fileContent = tokens.generateCss(true);

        writeFileSync(outputPath, fileContent, "utf8");
      }
    });
  } catch (e) {
    console.error("No valid inputfile for design tokens");
  }
}
