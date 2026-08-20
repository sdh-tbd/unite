import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { Checkbox } from "./checkbox"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    label: "Remember me",
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: { hint: "Save my login details for next time." },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Checkbox {...args} size="sm" label="Small" />
      <Checkbox {...args} size="md" label="Medium" />
    </div>
  ),
}

export const Checked: Story = {
  args: { defaultSelected: true },
}

export const Indeterminate: Story = {
  args: { isIndeterminate: true },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}

export const Toggles: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole("checkbox", { name: "Remember me" })

    await expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)

    await expect(checkbox).toBeChecked()
  },
}
