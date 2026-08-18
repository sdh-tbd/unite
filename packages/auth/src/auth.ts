import { type BetterAuthOptions, betterAuth } from "better-auth"
import { type AuthConfig, authConfigSchema } from "./config"

export type CreateAuthOptions = AuthConfig & Omit<BetterAuthOptions, "baseURL" | "secret">

/**
 * Build a server-side Better Auth instance.
 *
 * `baseURL` and `secret` are required and validated; every other Better Auth
 * option is optional and overrides the defaults below, so apps that need a
 * different setup (extra plugins, social providers, a different app name) can
 * extend without forking this package.
 *
 * Scaffold only: no database adapter is configured yet, so Better Auth falls
 * back to an in-memory store and nothing survives a restart. When the database
 * package lands, apps can pass `database` through these options.
 */
export function createAuth({ baseURL, secret, ...overrides }: CreateAuthOptions) {
  const config = authConfigSchema.parse({ baseURL, secret })

  return betterAuth({
    appName: "unite",
    emailAndPassword: { enabled: true },
    ...overrides,
    baseURL: config.baseURL,
    secret: config.secret,
  })
}

export type Auth = ReturnType<typeof createAuth>
export type Session = Auth["$Infer"]["Session"]
export type User = Session["user"]
