#!/usr/bin/env node

const { Command } = require("commander");
const nodemon = require("nodemon");
const path = require("path");
// const { exec } = require("node:child_process");
const { glob } = require("glob");

// @ts-ignore
const packagejson = require("../package.json");

console.log({ packagejson });
const { exec } = require("child_process");

const rootDir = process.cwd();

const FILENAME = "designTokens.config.js";

function getConfigPath() {
  return glob(`**/${FILENAME}`, {
    ignore: "node_modules/**",
  }).then(([filePath]) => {
    if (!filePath) throw new Error(`No config file found (${FILENAME})`);
    return path.relative(__dirname, filePath);
  });
}

/**
 * @param {string} [configPath]
 */
function buildScript(configPath) {
  return `node ./bin/build.js ${configPath}`;
}

const program = new Command();

program
  .name("design-tokens")
  .description(packagejson.description)
  .version(packagejson.version);

program
  .command("dev")
  .description("Create css variables from design tokens typescript file")
  .action(async () => {
    const configPath = await getConfigPath();

    const instance = nodemon({
      script: buildScript(configPath),
      watch: [configPath],
    });

    instance
      .on("quit", function () {
        process.exit();
      })
      .on("start", function () {
        const filePath = path.relative(rootDir, configPath);
        console.log(`Design tokens Waiting for change file ${filePath}`);
      })
      .on("restart", function (files) {
        files?.forEach((file) => {
          const filePath = path.relative(rootDir, file);
          console.log(`Design tokens created from ${filePath}`);
        });
      });
  });

program
  .command("build")
  .description("Create css variables from design tokens typescript file")
  .action(async () => {
    const configPath = await getConfigPath();

    exec(buildScript(configPath))
      .on("close", function () {
        const filePath = path.relative(rootDir, configPath);
        console.log(`Design tokens created from: ${filePath}`);
      })
      .on("error", console.log);
  });

program.parse();
