#! /usr/bin/env node

const { writeFileSync } = require("fs");
const prettier = require("prettier");

const [configPath] = process.argv.slice(2);

if (!configPath) throw new Error(`No configPath provided`);

/** @type {import('@classes/Atomic').Atomic<any>} */
const atomic = require(configPath);

if (atomic.config.exports) {
  if (atomic.config.exports.tokens) {
    const fileContents = prettier.format(atomic.formatTokens(), {
      parser: atomic.config.mode,
    });
    writeFileSync(atomic.config.exports.tokens, fileContents, "utf8");
  }
  if (atomic.config.exports.styles) {
    const fileContents = prettier.format(atomic.formatStyles());
    writeFileSync(atomic.config.exports.styles, fileContents, "utf8");
  }
}
