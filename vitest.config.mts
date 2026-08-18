import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // Root-level tests only. Packages and apps own their own vitest config and
    // run through the `test` turbo task.
    include: ["tests/**/*.test.ts"],
    // A run that matches nothing is a silent false pass — the exact failure the
    // smoke test guards against. Make it a hard error instead.
    passWithNoTests: false,
  },
})
