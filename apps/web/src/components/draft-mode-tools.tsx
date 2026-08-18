import { draftMode } from "next/headers"
import { VisualEditing } from "next-sanity/visual-editing"
import { DisableDraftMode } from "./disable-draft-mode"

export async function DraftModeTools() {
  const { isEnabled } = await draftMode()

  if (!isEnabled) {
    return null
  }

  return (
    <>
      <DisableDraftMode />
      <VisualEditing />
    </>
  )
}
