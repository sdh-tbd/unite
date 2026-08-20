import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { ComboBox } from "./combobox"
import { SelectItem } from "./select-item"
import { items } from "./story-items"

const meta = {
  title: "Components/Select/ComboBox",
  component: ComboBox,
  args: {
    label: "Team member",
    placeholder: "Search team members",
    items,
    children: (item) => <SelectItem {...item} />,
  },
  render: (args) => (
    <div className="w-80">
      <ComboBox {...args} />
    </div>
  ),
} satisfies Meta<typeof ComboBox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithShortcut: Story = {
  args: { shortcut: true },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}

export const FiltersAsYouType: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByRole("combobox", { name: "Team member" }), "Lana")

    const listbox = within(document.body)
    await expect(await listbox.findByRole("option", { name: /Lana Steiner/ })).toBeVisible()
    await expect(listbox.queryByRole("option", { name: /Olivia Rhye/ })).not.toBeInTheDocument()
  },
}
