import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  resolve: { alias: { "~": path.resolve("./src") } },
  test: {
    include: ["src/**/*.test.ts"],
    server: {
      deps: {
        external: ["rehype-prism-plus"],
        inline: ["react-avatar-editor"],
      },
    },
  },
})
