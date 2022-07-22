import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "tokens",
      fileName: (format) => `tokens.${format}.js`,
    },
  },
  plugins: [dts(), tsconfigPaths()],
});
