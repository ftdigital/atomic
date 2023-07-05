#! /usr/bin/env node

const { writeFileSync } = require("fs");

const [configPath] = process.argv.slice(2);

console.log(process.argv);

if (!configPath) throw new Error(`No configPath provided`);

/** @type {import('@classes/Atomic').Atomic} */
const atomic = require(configPath);

if (atomic.config.exports) {
  if (atomic.config.exports.tokens) {
    writeFileSync(atomic.config.exports.tokens, atomic.formatTokens(), "utf8");
  }
  if (atomic.config.exports.styles) {
    writeFileSync(atomic.config.exports.styles, atomic.formatStyles(), "utf8");
  }
}
