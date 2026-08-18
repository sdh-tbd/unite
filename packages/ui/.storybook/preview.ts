import type { Preview } from "@storybook/react-vite"
import "../src/styles.css"

const preview: Preview = {
  // Every component gets a generated docs page from its props and stories, so
  // @storybook/addon-docs has something to render. Opt a component out with
  // `tags: ["!autodocs"]` on its meta.
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // "todo" reports accessibility violations without failing the Vitest run.
    // Flip to "error" once the component set is clean.
    a11y: {
      test: "todo",
    },
  },
}

export default preview
