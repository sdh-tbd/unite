import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Suspense } from "react"
import { DraftModeTools } from "@/components/draft-mode-tools"
import { SanityLive } from "@/sanity/live"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Unite",
    template: "%s | Unite",
  },
  description: "Unite web app",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <SanityLive />
        <Suspense fallback={null}>
          <DraftModeTools />
        </Suspense>
      </body>
    </html>
  )
}
