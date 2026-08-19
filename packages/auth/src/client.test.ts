import { afterEach, describe, expect, it, vi } from "vitest"
import { createAuthClient } from "./client"

const baseURL = "http://localhost:3000"

describe("createAuthClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("builds a vanilla client from valid config", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(null), { status: 200 })),
    )

    const client = createAuthClient({ baseURL })

    expect(client.getSession).toBeTypeOf("function")
    expect(client.signOut).toBeTypeOf("function")
  })

  it("rejects a non-URL baseURL", () => {
    expect(() => createAuthClient({ baseURL: "localhost:3000" })).toThrow()
  })
})
