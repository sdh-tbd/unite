import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@unite/ui/components/base/buttons/button"
import { Copy01, Edit01, Trash01 } from "@untitledui/icons"
import { expect, userEvent, within } from "storybook/test"
import { Dropdown } from "./dropdown"

const meta = {
  title: "Components/Dropdown",
  component: Dropdown.Menu,
  render: () => (
    <Dropdown.Root>
      <Button color="secondary">Options</Button>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item icon={Edit01} label="Edit" addon="⌘E" />
          <Dropdown.Item icon={Copy01} label="Duplicate" addon="⌘D" />
          <Dropdown.Separator />
          <Dropdown.Item icon={Trash01} label="Delete" addon="⌘⌫" />
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  ),
} satisfies Meta<typeof Dropdown.Menu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSections: Story = {
  render: () => (
    <Dropdown.Root>
      <Button color="secondary">Account</Button>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Section>
            <Dropdown.SectionHeader className="px-3 py-1.5 text-xs font-semibold text-tertiary">
              Account
            </Dropdown.SectionHeader>
            <Dropdown.Item label="Profile" />
            <Dropdown.Item label="Settings" />
          </Dropdown.Section>
          <Dropdown.Separator />
          <Dropdown.Section>
            <Dropdown.SectionHeader className="px-3 py-1.5 text-xs font-semibold text-tertiary">
              Team
            </Dropdown.SectionHeader>
            <Dropdown.Item label="Invite colleagues" />
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  ),
}

export const DotsTrigger: Story = {
  render: () => (
    <Dropdown.Root>
      <Dropdown.DotsButton />
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item label="Edit" />
          <Dropdown.Item label="Delete" />
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  ),
}

export const OpensOnClick: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: "Options" }))

    await expect(
      await within(document.body).findByRole("menuitem", { name: /Duplicate/ }),
    ).toBeInTheDocument()
  },
}
