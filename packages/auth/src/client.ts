import { createAuthClient as createBetterAuthClient } from "better-auth/client"
import { type AuthClientConfig, authClientConfigSchema } from "./config"

type BetterAuthClientOptions = Parameters<typeof createBetterAuthClient>[0]

export type CreateAuthClientOptions = AuthClientConfig & Omit<BetterAuthClientOptions, "baseURL">

/**
 * Build a vanilla Better Auth client (`better-auth/client`).
 *
 * Apps construct their own client so they can pass their own `baseURL` and
 * layer on client plugins. The returned object carries `signIn` / `signUp` /
 * `signOut` / `getSession`. It does **not** include React hooks such as
 * `useSession` — when an app needs those, it creates a React client with
 * `better-auth/react` itself.
 *
 * React is not a dependency of this package.
 */
export function createAuthClient({ baseURL, ...overrides }: CreateAuthClientOptions = {}) {
  const config = authClientConfigSchema.parse({ baseURL })

  return createBetterAuthClient({
    ...overrides,
    baseURL: config.baseURL,
  })
}

export type AuthClient = ReturnType<typeof createAuthClient>
