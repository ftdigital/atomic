const { Command } = require("commander");
const program = new Command();
const { exec } = require("node:child_process");

program
  .name("design-tokens")
  .description("CLI to some JavaScript string utilities")
  .version("0.8.0");

program
  .command("build")
  .description("Create css variables in css document")
  .argument("<path>", "path to tokens typescript file")
  .action((path) => {
    exec("npx tsc " + path, (err, output) => {
      // once the command has completed, the callback function is called
      if (err) {
        // log and return if we encounter an error
        console.error("could not execute command: ", err);
        return;
      }
      // log the output received from the command
      console.log("Output: \n", output);
    });
  });

program.parse();
