import * as z from "zod"

/**
 * Better Auth rejects a `baseURL` without an `http(s)` scheme, but it only does
 * so lazily at request time. Enforcing the protocol here turns that into an
 * eager, readable validation error at construction.
 */
const httpURL = z.url({ protocol: /^https?$/ })

/**
 * Shape a consuming app must supply to `createAuth`. The package deliberately
 * never reads `process.env` itself — apps own their environment and pass the
 * resolved values in, so this package stays runtime-agnostic.
 */
export const authConfigSchema = z.object({
  /** Absolute URL of the app that mounts the Better Auth route handler. */
  baseURL: httpURL,
  /** Signing/encryption secret. Generate with: openssl rand -base64 32 */
  secret: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
})

export type AuthConfig = z.infer<typeof authConfigSchema>

/** Shape a consuming app must supply to `createAuthClient`. */
export const authClientConfigSchema = z.object({
  /**
   * Absolute URL the client calls. Omit for same-origin apps, where Better
   * Auth infers the origin from the browser.
   */
  baseURL: httpURL.optional(),
})

export type AuthClientConfig = z.infer<typeof authClientConfigSchema>
