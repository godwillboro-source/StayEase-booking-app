import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./setup.js"],
    include: ["tests/**/*.test.{js,jsx}"],
    restoreMocks: true,
    clearMocks: true
  }
}));
