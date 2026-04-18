import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "atomic",
      fileName: (format) => `atomic.${format}.js`,
    },
    rollupOptions: {
      external: ['fs'],
      output: {
        globals: { fs: 'fs' },
      },
    },
  },
  resolve: {
    alias: {
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  plugins: [tsconfigPaths(), dts()],
});
