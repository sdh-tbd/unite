import { describe, expect, it } from "vitest"
import { createAuth } from "./auth"

const baseURL = "http://localhost:3000"
const secret = "0".repeat(32)

describe("createAuth", () => {
  it("builds an instance from valid config", () => {
    const auth = createAuth({ baseURL, secret })

    expect(auth.handler).toBeTypeOf("function")
    expect(auth.api.getSession).toBeTypeOf("function")
  })

  it("rejects a non-URL baseURL", () => {
    expect(() => createAuth({ baseURL: "localhost:3000", secret })).toThrow()
  })

  it("rejects a short secret", () => {
    expect(() => createAuth({ baseURL, secret: "too-short" })).toThrow()
  })

  it("lets apps override defaults", () => {
    const auth = createAuth({ baseURL, secret, appName: "other" })

    expect(auth.options.appName).toBe("other")
  })
})
