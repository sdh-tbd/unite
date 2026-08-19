import { draftMode } from "next/headers"
import { VisualEditing } from "next-sanity/visual-editing"
import { SanityLive } from "@/sanity/live"
import { DisableDraftMode } from "./disable-draft-mode"

/**
 * Runtime companion for Sanity Live and Visual Editing.
 *
 * `draftMode()` reads a cookie, so it is request-time data. The root layout
 * stays synchronous so Cache Components can prerender `/` as static; awaiting
 * `draftMode()` there would make every page dynamic.
 *
 * This async child is wrapped in `<Suspense>` in the layout, which isolates
 * the cookie read from the static shell. Strict `defineLive` requires
 * `<SanityLive includeDrafts={...} />`, and that flag is the same `isEnabled`
 * already used here for overlays, so one `draftMode()` call owns the live
 * and draft runtime.
 */
export async function DraftModeTools() {
  const { isEnabled } = await draftMode()

  return (
    <>
      <SanityLive includeDrafts={isEnabled} />
      {isEnabled ? (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      ) : null}
    </>
  )
}
