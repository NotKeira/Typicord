import { defineConfig } from "tsup";

import pkg from "./package.json";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true, // generate types in dist/
  outDir: "dist",
  clean: true,
  splitting: false, // single file per format
  sourcemap: true,
  minify: false,
  target: "node18",
  define: {
    __CLIENT_VERSION__: JSON.stringify(pkg.version),
  },
  esbuildOptions(options) {
    // For CJS, output .cjs extension
    if (options.format === "cjs") {
      options.outExtension = { ".js": ".cjs" };
    }
  },
});
