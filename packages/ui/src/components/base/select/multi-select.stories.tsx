import type { Meta, StoryObj } from "@storybook/react-vite"
import { MultiSelect } from "./multi-select"
import { SelectItem } from "./select-item"
import { items } from "./story-items"

const meta = {
  title: "Components/Select/MultiSelect",
  component: MultiSelect,
  args: {
    label: "Team members",
    placeholder: "Select team members",
    items,
    children: (item) => <SelectItem {...item} />,
  },
  render: (args) => (
    <div className="w-80">
      <MultiSelect {...args} />
    </div>
  ),
} satisfies Meta<typeof MultiSelect>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSelection: Story = {
  args: { defaultSelectedKeys: new Set(["olivia", "lana"]) },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}
