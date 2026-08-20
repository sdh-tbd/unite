import { getLocalTimeZone, today } from "@internationalized/date"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { Calendar } from "./calendar"
import { DatePicker } from "./date-picker"
import { DateRangePicker } from "./date-range-picker"

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: today(getLocalTimeZone()) },
}

export const Range: Story = {
  render: () => <DateRangePicker />,
}

export const InlineCalendar: Story = {
  render: () => <Calendar />,
}

export const OpensCalendar: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const trigger = canvas.getByRole("button")
    await expect(trigger).toHaveTextContent("Select date")

    await userEvent.click(trigger)

    await expect(await within(document.body).findByRole("dialog")).toBeInTheDocument()
  },
}
