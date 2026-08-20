import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { Select } from "./select"
import { items } from "./story-items"

const meta = {
  title: "Components/Select",
  component: Select,
  args: {
    label: "Team member",
    placeholder: "Select a team member",
    items,
    children: (item) => <Select.Item {...item} />,
  },
  render: (args) => (
    <div className="w-80">
      <Select {...args} />
    </div>
  ),
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: { hint: "This is who the task gets assigned to." },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Select {...args} key={size} size={size} label={size} />
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  args: { isDisabled: true },
}

export const OpensAndSelects: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /Select a team member/ }))

    const option = await within(document.body).findByRole("option", { name: /Olivia Rhye/ })
    await userEvent.click(option)

    await expect(canvas.getByRole("button", { name: /Olivia Rhye/ })).toBeVisible()
  },
}
