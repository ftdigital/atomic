#! /usr/bin/env node

const { Command } = require("commander");
const nodemon = require("nodemon");
const path = require("path");
const { glob } = require("glob");

// @ts-ignore
const packagejson = require("../package.json");
const { exec } = require("child_process");

const FILENAME = "atomic.config.js";

function getConfigPath() {
  return glob(`**/${FILENAME}`, {
    root: __dirname,
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
  return `node ${JSON.stringify(
    path.resolve(__dirname, "./build.js")
  )} ${JSON.stringify(configPath)}`;
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
      script: configPath,
      execMap: {
        js: buildScript(configPath),
      },
      watch: [path.resolve(__dirname, configPath)],
    });

    instance
      .on("quit", function () {
        process.exit();
      })
      .on("start", function () {
        console.log(`Waiting for file changes in ${FILENAME}`);
      })
      .on("restart", function (files) {
        files?.forEach(() => {
          console.log(`Files created from ${FILENAME}`);
        });
      });
  });

program
  .command("build")
  .description("Create css variables from design tokens typescript file")
  .action(async () => {
    const configPath = await getConfigPath();
    exec(buildScript(configPath)).on("close", function () {
      console.log(`Design tokens created from ${FILENAME}`);
    });
  });

program.parse(process.argv);
