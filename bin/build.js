console.log({ test: "configPath" });

const { writeFileSync } = require("fs");

const [configPath] = process.argv;

if (!configPath) throw new Error(`No configPath provided`);

/** @type {import('@classes/DesignTokens').DesignTokens} */
const tokens = require(configPath);

Object.entries(tokens.config.exports || {}).map(([type, path]) => {
  // @ts-ignore
  const fileContent = tokens.format(type);

  writeFileSync(path, fileContent, "utf8");
});
