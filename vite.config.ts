import { defineConfig } from "vite";
import eslint from "@rollup/plugin-eslint";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [{ ...eslint(), enforce: "pre" }, vue()],
  test: {
    globals: true,
    environment: "happy-dom",
  },
});
