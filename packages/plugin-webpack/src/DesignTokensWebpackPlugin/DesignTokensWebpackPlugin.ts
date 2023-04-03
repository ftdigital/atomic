import type { DesignTokens } from "@design-tokens/design-tokens";
import { DesignTokensPluginWebpackConfig } from "types";
import { Compiler, EntryPlugin, WebpackPluginInstance } from "webpack";

export class DesignTokensWebpackPlugin implements WebpackPluginInstance {
  public readonly name = "DesignTokensWebpackPlugin";

  constructor(private config: DesignTokensPluginWebpackConfig) {}

  log(message: string) {
    console.log(`[${this.name}] ${message}`);
  }

  apply(compiler: Compiler) {
    const pluginName = this.name;
    const config = this.config;

    // webpack module instance can be accessed from the compiler object,
    // this ensures that correct version of the module is used
    // (do not require/import the webpack or any symbols from it directly).
    const { webpack } = compiler;

    // Compilation object gives us reference to some useful constants.
    const { Compilation } = webpack;

    // RawSource is one of the "sources" classes that should be used
    // to represent asset sources in compilation.
    const { RawSource } = webpack.sources;

    // Tapping to the "thisCompilation" hook in order to further tap
    // to the compilation process on an earlier stage.
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      const childCompiler = compilation.createChildCompiler(
        `${pluginName}Child`,
        {
          library: {
            type: "commonjs-module"
          }
        },
        [
          new EntryPlugin(compiler.context, config.path, {
            name: `child-output`,
            filename: "design-tokens.js"
          }),
          new webpack.library.EnableLibraryPlugin("commonjs-module")
        ]
      );

      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        (_assets, callback) => {
          childCompiler.runAsChild((error, _entries, _compilation) => {
            const { outputPath } = compiler;
            const fileName = Array.from(_entries![0]!.files.values())[0]!;
            const filePath = `${outputPath}/${fileName}`;

            const designTokens = require(filePath).default as DesignTokens;

            const tokens = designTokens.tokens;

            compilation.emitAsset(
              "design-tokens.css",
              new RawSource(tokens.length.toString())
            );

            callback(error);
          });
        }
      );
    });
  }
}
