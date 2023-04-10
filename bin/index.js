#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const nodemon = require("nodemon");
const path = require("path");
const { exec } = require("node:child_process");

const packagejson = require("../package.json");

const rootDir = process.cwd();

function tsNodeScript(inputPath) {
  return `ts-node --project ./bin/tsconfig.json ./src/scripts/writeTokensToCssFile.ts ${inputPath}`;
}

program
  .name("design-tokens")
  .description(packagejson.description)
  .version(packagejson.version);

program
  .command("dev")
  .description("Create css variables from design tokens typescript file")
  .argument("<path>", "path to design tokens typescript file")
  .action((_path) => {
    const inputPath = path.join(rootDir, _path);

    const instance = nodemon({
      script: inputPath,
      execMap: {
        ts: tsNodeScript(inputPath),
      },
      watch: [inputPath],
    });

    instance
      .on("quit", function () {
        process.exit();
      })
      .on("start", function () {
        const filePath = path.relative(rootDir, inputPath);
        console.log(`Design tokens Waiting for change file: ${filePath}`);
      })
      .on("restart", function (files) {
        files.forEach((file) => {
          const filePath = path.relative(rootDir, file);

          console.log(`Design tokens created from: ${filePath}`);
        });
      });
  });

program
  .command("build")
  .description("Create css variables from design tokens typescript file")
  .argument("<path>", "path to design tokens typescript file")
  .action((_path) => {
    const inputPath = path.join(rootDir, _path);

    exec(tsNodeScript(inputPath)).on("close", function () {
      const filePath = path.relative(rootDir, inputPath);

      console.log(`Design tokens created from: ${filePath}`);
    });
  });

program.parse();
