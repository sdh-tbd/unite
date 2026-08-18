"use client"

import { useVisualEditingEnvironment } from "next-sanity/hooks"

export function DisableDraftMode() {
  const environment = useVisualEditingEnvironment()

  if (environment !== "standalone" && environment !== null) {
    return null
  }

  return (
    <a
      className="fixed right-4 bottom-4 rounded bg-black px-4 py-2 text-sm text-white"
      href="/api/draft-mode/disable"
    >
      Disable draft mode
    </a>
  )
}
