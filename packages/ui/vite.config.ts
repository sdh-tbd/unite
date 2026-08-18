import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import type { UserConfig } from "vite"

// The package ships as source and has no build step of its own. This config
// exists only so Storybook and the Vitest browser run share one Vite pipeline:
// Storybook picks it up automatically, and vitest.config.ts merges it in.
const config: UserConfig = {
  plugins: [react(), tailwindcss()],
}

export default config
