import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig, mergeConfig } from "vitest/config"
import viteConfig from "./vite.config.ts"

// Every story is also a test: the Storybook Vitest plugin turns each export in
// a *.stories.tsx file into a case that renders in a real browser and runs its
// play function, with .storybook/preview.ts applied automatically. Requires
// Playwright's Chromium — see the README.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          plugins: [storybookTest({ configDir: ".storybook" })],
          test: {
            name: "storybook",
            browser: {
              enabled: true,
              provider: playwright(),
              headless: true,
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  }),
)
