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
  args: { color: "secondary" },
}

export const Tertiary: Story = {
  args: { color: "tertiary" },
}

export const Destructive: Story = {
  args: { color: "primary-destructive" },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
      <Button {...args} size="xl" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { isDisabled: true },
}

export const Loading: Story = {
  args: { isLoading: true },
}

export const Clicks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button", { name: "Click me" })

    await userEvent.click(button)

    await expect(button).toBeEnabled()
  },
}
