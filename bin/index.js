#! /usr/bin/env node

const { Command } = require("commander");
const nodemon = require("nodemon");
const path = require("path");
const { glob } = require("glob");

// @ts-ignore
const packagejson = require("../package.json");
const { exec } = require("child_process");

const relativeProjectRoot = path.relative(__dirname, path.resolve("./"));

const FILENAME = "designTokens.config.js";

function getConfigPath() {
  return glob(`**/${FILENAME}`, {
    root: relativeProjectRoot,
    ignore: "node_modules/**",
  }).then(([filePath]) => {
    if (!filePath) throw new Error(`No config file found (${FILENAME})`);
    return path.join(relativeProjectRoot, filePath);
  });
}

/**
 * @param {string} [configPath]
 */
function buildScript(configPath) {
  return `node ${path.resolve(__dirname, "./build.js")} ${configPath}`;
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
      nodeArgs: [],
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
        const filePath = path.relative(relativeProjectRoot, configPath);
        console.log(`Waiting for file changes in ${filePath}`);
      })
      .on("restart", function (files) {
        files?.forEach((file) => {
          const filePath = path.relative(relativeProjectRoot, file);
          console.log(`Files created from ${filePath}`);
        });
      });
  });

program
  .command("build")
  .description("Create css variables from design tokens typescript file")
  .action(async () => {
    const configPath = await getConfigPath();
    exec(buildScript(configPath)).on("close", function () {
      console.log(`Design tokens created from: ${configPath}`);
    });
  });

program.parse(process.argv);
