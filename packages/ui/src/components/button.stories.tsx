import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { Button } from "./button"

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Click me",
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: "secondary" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Clicks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button", { name: "Click me" })

    await userEvent.click(button)

    await expect(button).toBeEnabled()
  },
}
