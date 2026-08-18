import { expect, it } from "vitest"

it("resolves the root vitest config", async () => {
  const { default: config } = await import("../vitest.config.mts")

  expect(config.test?.include).toContain("tests/**/*.test.ts")
  expect(config.test?.passWithNoTests).toBe(false)
})

it("fails the run when an assertion fails", () => {
  expect(() => expect(1).toBe(2)).toThrow()
})
