#! /usr/bin/env node

const { Command } = require("commander");
const nodemon = require("nodemon");
const path = require("path");
const { glob } = require("glob");

// @ts-ignore
const packagejson = require("../package.json");
const { exec } = require("child_process");

async function getConfigPaths() {
  const filePaths = await glob("**/*.atomic.{cjs,js}", {
    root: __dirname,
    ignore: "node_modules/**",
  });

  if (filePaths.length < 1) throw new Error("No config file found");

  return filePaths.map((filePath) => path.relative(__dirname, filePath));
}

/**
 * @param {string[]} [configPaths]
 */
function buildScript(configPaths) {
  return `node ${JSON.stringify(
    path.resolve(__dirname, "./build.js")
  )} ${configPaths.map((configPath) => JSON.stringify(configPath)).join(" ")}`;
}

const program = new Command();

program
  .name("atomic")
  .description(packagejson.description)
  .version(packagejson.version);

program
  .command("dev")
  .description("Create files from Atomic config")
  .action(async () => {
    const configPaths = await getConfigPaths();

    const instance = nodemon({
      // script: configPath,
      exec: buildScript(configPaths),
      watch: configPaths.map((configPath) =>
        path.resolve(__dirname, configPath)
      ),
    });

    instance
      .on("quit", function () {
        process.exit();
      })
      .on("start", function () {
        console.log(`Atomic waiting for file changes`);
      })
      .on("restart", function (files) {
        files?.forEach(() => {
          console.log(`Atomic files created`);
        });
      })
      .on("crash"),
      function () {
        console.log(`Error while creating atomic files`);
      };
  });

program
  .command("build")
  .description("Create files from Atomic config")
  .action(async () => {
    const configPaths = await getConfigPaths();

    exec(buildScript(configPaths))
      .on("close", function () {
        console.log(`Atomic files created`);
      })
      .on("error", function () {
        console.log(`Error while creating atomic files`);
      });
  });

program.parse(process.argv);
