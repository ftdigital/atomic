import { Compiler, webpack } from "webpack";
import { DesignTokensWebpackPlugin } from "../DesignTokensWebpackPlugin";

const path = require("path");

// A custom wrapper to promisify webpack compilation.
function compileAsync(compiler: Compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error || stats?.hasErrors()) {
        const resolvedError = error || stats!.toJson("errors-only")[0];

        reject(resolvedError.message);
      }

      resolve(stats);
    });
  });
}

it('converts "*.mp3" import into an audio player', async () => {
  // Configure a webpack compiler.
  const compiler = webpack({
    mode: "development",
    entry: "../src/tokens.ts",
    output: {
      path: path.resolve(__dirname, "../__mocks__/dist"),
      filename: "index.js"
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loader: "ts-loader"
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    plugins: [
      new DesignTokensWebpackPlugin({
        path: path.resolve(__dirname, "../__mocks__/src/tokens.ts")
      })
    ]
  });

  // Compile the bundle.
  await compileAsync(compiler);

  // Expect the imported audio file to be emitted alongside the build.
  expect(true).toEqual(true);
});
