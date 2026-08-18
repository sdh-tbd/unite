import { createAuthClient as createBetterAuthClient } from "better-auth/react"
import { type AuthClientConfig, authClientConfigSchema } from "./config"

type BetterAuthClientOptions = Parameters<typeof createBetterAuthClient>[0]

export type CreateAuthClientOptions = AuthClientConfig & Omit<BetterAuthClientOptions, "baseURL">

/**
 * Build a browser-side Better Auth client.
 *
 * Apps construct their own client so they can pass their own `baseURL` and
 * layer on client plugins. The returned object carries the usual
 * `signIn` / `signUp` / `signOut` / `useSession` / `getSession` members.
 *
 * React is not a dependency of this package — the consuming app supplies the
 * single React instance that `better-auth/react` hooks bind to.
 */
export function createAuthClient({ baseURL, ...overrides }: CreateAuthClientOptions = {}) {
  const config = authClientConfigSchema.parse({ baseURL })

  return createBetterAuthClient({
    ...overrides,
    baseURL: config.baseURL,
  })
}

export type AuthClient = ReturnType<typeof createAuthClient>
