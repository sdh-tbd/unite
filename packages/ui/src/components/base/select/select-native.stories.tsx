import type { Meta, StoryObj } from "@storybook/react-vite"
import { NativeSelect } from "./select-native"

const options = [
  { label: "Phoenix Baker", value: "phoenix" },
  { label: "Olivia Rhye", value: "olivia" },
  { label: "Lana Steiner", value: "lana" },
  { label: "Demi Wilkinson", value: "demi", disabled: true },
]

const meta = {
  title: "Components/Select/Native",
  component: NativeSelect,
  args: {
    label: "Team member",
    options,
  },
  render: (args) => (
    <div className="w-80">
      <NativeSelect {...args} />
    </div>
  ),
} satisfies Meta<typeof NativeSelect>

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
        <NativeSelect {...args} key={size} size={size} label={size} />
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
