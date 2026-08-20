import type { Meta, StoryObj } from "@storybook/react-vite"
import { Mail01, SearchLg } from "@untitledui/icons"
import { expect, userEvent, within } from "storybook/test"
import { Input } from "./input"

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    label: "Email",
    placeholder: "olivia@untitledui.com",
  },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: { hint: "This is a hint text to help the user." },
}

export const WithIcon: Story = {
  args: { icon: Mail01 },
}

export const WithShortcut: Story = {
  args: { label: "Search", placeholder: "Search", icon: SearchLg, shortcut: true },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <Input {...args} size="sm" label="Small" />
      <Input {...args} size="md" label="Medium" />
      <Input {...args} size="lg" label="Large" />
    </div>
  ),
}

export const Invalid: Story = {
  args: { isInvalid: true, hint: "This is not a valid email address." },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}

export const AcceptsTyping: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("textbox", { name: "Email" })

    await userEvent.type(input, "olivia@untitledui.com")

    await expect(input).toHaveValue("olivia@untitledui.com")
  },
}
