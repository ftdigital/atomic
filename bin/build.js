#! /usr/bin/env node

const { writeFileSync } = require("fs");

const [configPath] = process.argv.slice(2);

if (!configPath) throw new Error(`No configPath provided`);

/** @type {import('@types').Atomic<any>} */
const atomic = require(configPath);

if (atomic.config.target) {
  const fileContents = atomic.format();
  writeFileSync(atomic.config.target, fileContents, "utf8");
}

export {};
