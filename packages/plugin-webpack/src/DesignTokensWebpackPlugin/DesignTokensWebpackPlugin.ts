import { DesignTokensPluginWebpackConfig } from "types";
import { Compiler, EntryPlugin, WebpackPluginInstance } from "webpack";
import { Volume, createFsFromVolume } from "memfs";

const mod = require("../__mocks__/dist/index");

console.dir(mod);

export class DesignTokensWebpackPlugin implements WebpackPluginInstance {
  public readonly name = "DesignTokensWebpackPlugin";

  constructor(protected config: DesignTokensPluginWebpackConfig) {}

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
      const childCompiler = compilation.createChildCompiler(pluginName, {}, [
        new EntryPlugin(compiler.context, config.path, {
          name: "design-tokens",
          filename: "[name].js"
        }),
        new webpack.library.EnableLibraryPlugin("var")
      ]);

      const volume = createFsFromVolume(new Volume());
      childCompiler.outputFileSystem = volume;

      childCompiler.compile((_error, childCompilation) => {
        const asset = childCompilation!.getAsset("design-tokens.js")!;

        const source = asset.source.source() as string;

        const test2 = eval(source);

        console.log(test2);

        if (source) {
          compilation.emitAsset("design-tokens.js", new RawSource(source));
        }
      });

      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        (_assets, callback) => {
          callback();
        }
      );
    });
  }
}
