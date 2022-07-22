import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "tokens",
      formats: ["es"],
      fileName: (format) => `tokens.${format}.js`,
    },
  },
  resolve: {
    alias: {
      "@classes": path.resolve(__dirname, "./src/classes"),
      "@helpers": path.resolve(__dirname, "./src/helpers"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  plugins: [tsconfigPaths(), dts()],
});
