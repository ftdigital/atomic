#! /usr/bin/env node

const { Command } = require("commander");
const nodemon = require("nodemon");
const path = require("path");
const { glob } = require("glob");

// @ts-ignore
const packagejson = require("../package.json");
const { exec } = require("child_process");

const FILENAME = "atomic.config.cjs";

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
  .name("atomic")
  .description(packagejson.description)
  .version(packagejson.version);

program
  .command("dev")
  .description("Create css files from Atomic config")
  .action(async () => {
    const configPath = await getConfigPath();

    const instance = nodemon({
      script: configPath,
      exec: buildScript(configPath),
      watch: [path.resolve(__dirname, configPath)],
    });

    instance
      .on("quit", function () {
        process.exit();
      })
      .on("start", function () {
        console.log(`Atomic waiting for file changes in ${FILENAME}`);
      })
      .on("restart", function (files) {
        files?.forEach(() => {
          console.log(`Atomic files created from ${FILENAME}`);
        });
      });
  });

program
  .command("build")
  .description("Create css files from atomic config")
  .action(async () => {
    const configPath = await getConfigPath();
    exec(buildScript(configPath)).on("close", function () {
      console.log(`Atomic files created from ${FILENAME}`);
    });
  });

program.parse(process.argv);
