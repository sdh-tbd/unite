import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { Carousel } from "./carousel-base"

const slides = ["Slide 1", "Slide 2", "Slide 3"]

const meta: Meta<typeof Carousel.Root> = {
  title: "Components/Carousel",
  component: Carousel.Root,
  render: (args) => (
    <div className="w-96">
      <Carousel.Root {...args}>
        <Carousel.Content>
          {slides.map((slide) => (
            <Carousel.Item key={slide} className="p-1">
              <div className="flex h-40 items-center justify-center rounded-lg bg-secondary text-display-xs font-semibold text-primary">
                {slide}
              </div>
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <div className="mt-4 flex items-center justify-between">
          <Carousel.PrevTrigger className="text-sm font-semibold text-brand-secondary disabled:opacity-50">
            Previous
          </Carousel.PrevTrigger>
          <Carousel.IndicatorGroup className="flex gap-2">
            {({ index }) => (
              <Carousel.Indicator
                key={index}
                index={index}
                className={({ isSelected }) =>
                  `size-2 rounded-full ${isSelected ? "bg-brand-solid" : "bg-quaternary"}`
                }
              />
            )}
          </Carousel.IndicatorGroup>
          <Carousel.NextTrigger className="text-sm font-semibold text-brand-secondary disabled:opacity-50">
            Next
          </Carousel.NextTrigger>
        </div>
      </Carousel.Root>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Looping: Story = {
  args: { opts: { loop: true } },
}

export const Vertical: Story = {
  render: (args) => (
    <div className="w-96">
      <Carousel.Root {...args} orientation="vertical">
        <Carousel.Content className="h-40">
          {slides.map((slide) => (
            <Carousel.Item key={slide} className="p-1">
              <div className="flex h-full items-center justify-center rounded-lg bg-secondary text-display-xs font-semibold text-primary">
                {slide}
              </div>
            </Carousel.Item>
          ))}
        </Carousel.Content>
      </Carousel.Root>
    </div>
  ),
}

export const AdvancesToNextSlide: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const previous = canvas.getByRole("button", { name: "Previous slide" })

    await expect(previous).toBeDisabled()

    await userEvent.click(canvas.getByRole("button", { name: "Next slide" }))

    await expect(previous).toBeEnabled()
  },
}
