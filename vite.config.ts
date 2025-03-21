import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/components/index.tsx"),
      name: "ReactSpinCarousel",
      fileName: (format) => `react-spin-carousel.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    emptyOutDir: true,
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: "./tsconfig.app.json",
      outDir: "dist",
      entryRoot: "src",
      insertTypesEntry: true,
    }),
  ],
});
