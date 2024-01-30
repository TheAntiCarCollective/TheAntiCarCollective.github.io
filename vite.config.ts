/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
  },
});
