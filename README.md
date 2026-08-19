# Unite

Turborepo monorepo for the Unite platform.

## Structure

```
apps/
  web/       Next.js 16 (App Router, Cache Components, Tailwind v4)
  studio/    Sanity Studio 6 (standalone, Presentation + Vision)
packages/
  ui/        Design system (React 19 + Tailwind v4, JIT/no build step) + Storybook
  auth/      Better Auth scaffold (no database wired up yet)
  config-biome/       Shared Biome presets (base, react, next, tailwind, test)
  config-tailwind/    Shared Tailwind v4 entrypoint + design tokens
  config-typescript/  Shared tsconfig presets
```

Packages are consumed as source (no build step) and every package composes the
shared configs, so a new app only has to extend the presets it needs.

## Tooling

| Concern     | Tool                                  |
| ----------- | ------------------------------------- |
| Build graph | Turborepo 2.10                        |
| Package mgr | pnpm 10 workspaces                    |
| Language    | TypeScript 7                          |
| Lint/format | Biome 2.5 (replaces ESLint + Prettier)|
| Styling     | Tailwind CSS v4                       |
| Workshop    | Storybook 10 (React + Vite)           |
| Auth        | Better Auth 1.7 (scaffold only)       |
| CMS         | Sanity (project `agp9zi1g`)           |

**pnpm stays on v10.** Vercel's build image supports pnpm 6–10 only, so bumping
`packageManager` in the root `package.json` to pnpm 11 breaks deploys. Keep
patch/minor upgrades within 10.x. See
[Vercel — Package Managers](https://vercel.com/docs/package-managers) for the
supported-versions table.

## Shared configs

New apps and packages wire up the three config packages instead of copying
settings around.

**Biome** — list the presets you need. Biome does not allow mixing `"//"` with
package presets, so always start the array with `base`:

```jsonc
// apps/<app>/biome.json
{
  "root": false,
  "extends": ["@unite/config-biome/base", "@unite/config-biome/next", "@unite/config-biome/tailwind"]
}
```

Available presets: `base` (formatter, lint rules, ignore patterns — always
first), `react`, `next`, `tailwind`, `test`.

**TypeScript** — extend one of `base.json`, `nextjs.json` or
`react-library.json`:

```jsonc
// apps/<app>/tsconfig.json
{ "extends": "@unite/config-typescript/nextjs.json" }
```

**Tailwind** — import the shared entrypoint instead of `tailwindcss` so the
design tokens in `packages/config-tailwind/src/theme.css` come along:

```css
@import "@unite/config-tailwind/index.css";

@source "../../src/**/*.{ts,tsx}";
```

`@unite/ui` already does this, so apps importing `@unite/ui/styles.css` inherit
the tokens transitively.

## Storybook

Storybook lives in `@unite/ui` — it is the workshop for the design system, so it
stays next to the components rather than being its own app.

```bash
pnpm storybook        # dev server on http://localhost:6006
pnpm build-storybook  # static build into packages/ui/storybook-static (gitignored)
```

Stories sit beside their component as `*.stories.tsx` and are picked up from
`packages/ui/src/**`. `.storybook/preview.ts` imports `src/styles.css`, so every
story renders with the shared Tailwind tokens.

`packages/ui/vite.config.ts` exists only to give Storybook and Vitest one shared
Vite pipeline (React + Tailwind plugins). The package itself still ships as
source with no build step.

**Stories are the component tests.** `@storybook/addon-vitest` turns every story
export into a Vitest case that renders in real Chromium and runs its `play`
function, so `pnpm test` covers them with no separate test files. That needs
Playwright's browser binary once per machine:

```bash
pnpm --filter @unite/ui exec playwright install chromium
```

Accessibility checks run through `@storybook/addon-a11y` in `"todo"` mode:
violations are reported but do not fail the run. Flip `a11y.test` to `"error"`
in `.storybook/preview.ts` once the component set is clean.

## Auth

`@unite/auth` is a Better Auth scaffold. It has no database adapter and no route
handler mounted yet, and it deliberately depends on neither React nor
`@types/node`: it never reads `process.env`, so **apps own their environment**
and pass resolved values in. The package client wraps vanilla
`better-auth/client` — it has `signIn` / `signUp` / `signOut` / `getSession`,
not React hooks. When web mounts auth, `apps/web` should create a React client
with `better-auth/react` itself if it needs `useSession`.

Both entrypoints are factories, so an app can override or extend any Better Auth
option without forking the package:

```ts
// apps/<app>/src/auth.ts
import { createAuth } from "@unite/auth"

export const auth = createAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  // ...any other Better Auth option, e.g. socialProviders, plugins, database
})
```

```ts
// apps/<app>/src/auth-client.ts
import { createAuthClient } from "@unite/auth/client"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
})
```

`baseURL` and `secret` are validated with Zod at construction time, so a missing
or malformed env var fails loudly at startup rather than on the first request.
The required variables are listed in `apps/web/.env.example`.

## Dependency catalog

Versions shared across workspace packages live in the `catalog:` block of
`pnpm-workspace.yaml`, so every app and package resolves to the same version and
upgrades happen in one place. Depend on them by version protocol rather than by
literal version:

```jsonc
{
  "dependencies": { "react": "catalog:", "better-auth": "catalog:" },
  "peerDependencies": { "react": "catalog:peer" }
}
```

The rule: if a package is — or is likely to be — installed by more than one app
or package, catalog it. Root-only repo tooling (`turbo`, `husky`) and
package-internal deps (`clsx`, `tailwind-merge`) stay pinned where they are used.

There are two catalogs. The default one pins exact install versions. The named
`peer` catalog holds permissive ranges, because a peer dependency is a
compatibility contract rather than an install — pinning `react` to `19.2.8` in a
`peerDependencies` block would wrongly narrow what a consuming app may supply.

## Getting started

Requires Node 26+ (see `.nvmrc`) and pnpm 10.

```bash
nvm use
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env.local
pnpm dev
```

Web runs on http://localhost:3000, Studio on http://localhost:3333.

For draft mode / Visual Editing, create a Viewer token in
[Sanity Manage](https://www.sanity.io/manage/project/agp9zi1g/api) and set
`SANITY_API_READ_TOKEN` in `apps/web/.env.local`.

## Deploy

**Web** deploys to Vercel from this monorepo. Import the repo and set the
project Root Directory to `apps/web` (include files outside that directory).
`apps/web/vercel.json` runs `turbo run build --filter=web` from the repo root
and skips the build with `turbo-ignore` when web and its dependencies are
unchanged. Do not set `output: 'standalone'` unless you add Docker.

Set the Sanity public env vars from `apps/web/.env.example` in the Vercel
project. `SANITY_API_READ_TOKEN` is optional at runtime so published pages work
without a Viewer token.

**Studio** is not a Vercel app. Deploy it with Sanity hosting:

```bash
pnpm --filter studio deploy
```

That runs `sanity deploy`. Auto-updates are enabled in `apps/studio/sanity.cli.ts`.

## Scripts

Root scripts delegate to Turborepo; task logic lives in each package.

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Run all dev servers                      |
| `pnpm storybook`    | Storybook dev server (port 6006)         |
| `pnpm build-storybook` | Static Storybook build                |
| `pnpm build`        | Build all packages                       |
| `pnpm lint`         | Biome check (no writes)                  |
| `pnpm format`       | Biome check with autofix                 |
| `pnpm check-types`  | `tsc --noEmit` across the repo           |
| `pnpm test`         | Vitest across the repo                   |

Filter to a single package with `--filter`:

```bash
pnpm turbo run dev --filter=web
```

## Sanity TypeGen

Types are generated from the Studio schema plus GROQ queries in `apps/web`:

```bash
pnpm --filter studio run typegen
```

Output lands in `apps/web/sanity.types.ts` (gitignored — regenerate or run in CI).
TypeGen also runs automatically during `sanity dev` and `sanity build`.

Write queries with `defineQuery` so they are picked up:

```ts
import { defineQuery } from 'next-sanity'

export const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
```

## Conventions

- Package tasks over root tasks — every package owns its own `build`/`lint`/`check-types`.
  The only root tasks are `//#lint:root` / `//#format:root` / `//#test:root`, covering
  repo-root config files and the root smoke test, which belong to no package.
- Env vars used in code must be declared in the package's `turbo.json`; Biome's
  `turborepo` lint domain enforces this.
- No root `.env`; each app owns its own env files.
- Shared code belongs in `packages/`, never inside an app.

## Code review

`.husky/pre-commit` runs Biome over staged files plus `tsc` across the repo. It is
deterministic and offline. Bypass it with `SKIP_HOOKS=1 git commit`.

## License

[MIT](./LICENSE)
