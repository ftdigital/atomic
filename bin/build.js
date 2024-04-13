#! /usr/bin/env node

const { writeFileSync } = require("fs");

const configPaths = process.argv.slice(2);

configPaths.forEach((configPath) => {
  /** @type {import('@types').Atomic<any, any>} */
  const atomic = require(configPath);

  if (atomic.config.target) {
    const fileContents = atomic.format();
    writeFileSync(atomic.config.target, fileContents, "utf8");
  }
});
