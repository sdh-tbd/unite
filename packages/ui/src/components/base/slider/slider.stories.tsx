import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { Slider } from "./slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  args: {
    defaultValue: 40,
    "aria-label": "Volume",
  },
  render: (args) => (
    <div className="w-80 py-8">
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValueBelow: Story = {
  args: { labelPosition: "bottom" },
}

export const WithFloatingValue: Story = {
  args: { labelPosition: "top-floating" },
}

export const Range: Story = {
  args: { defaultValue: [20, 80] },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}

export const RendersThumb: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole("slider")).toHaveValue("40")
  },
}
