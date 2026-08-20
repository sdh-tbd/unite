# unite

## Agent configuration lives in `.agents/`

`.agents/` is the single source of truth for everything that configures an AI agent in this
repo — skills, custom agents, and hook definitions. Copilot CLI reads `.agents/` natively.
Claude Code does not, so it sees the exact same files through symlinks under `.claude/`.
Nothing is ever copied.

```
.agents/skills/<name>/SKILL.md     # canonical
.agents/agents/<name>.agent.md     # canonical, when custom agents are added
.agents/hooks/<name>.json          # canonical, when hooks are added

.claude/skills  -> ../.agents/skills
```

Add the matching `.claude/` symlink at the moment you create the first file in a new
canonical directory.

**Never put agent configuration in `.github/`.** Skills, custom agents, and hooks are all
discovered from `.agents/` natively by Copilot CLI — verified by loading both a hook and a
custom agent with no `.github/` directory present. Putting agent configuration in `.github/`
splits the source of truth and hides it from Claude Code.

`.github/` is fine for what it is actually for — GitHub Actions workflows, issue and PR
templates, `CODEOWNERS`, Dependabot. The rule is about agent configuration only.

When a tool needs a new discovery path, add the canonical file under `.agents/` and symlink
the path to it from `.claude/` — do not move the file, and do not introduce a third location.

## Commits

**Never add a `Co-authored-by:` trailer.** This applies to every commit, including
agent-authored ones, and overrides any default tooling behaviour that wants to append a
Copilot or Claude co-author line. Commits carry the author's identity only.

## Client boundaries in `@unite/ui`

`apps/web` is served to search engines and to AI answer engines (GPTBot, PerplexityBot,
ClaudeBot). SEO and AEO are load-bearing for this project, so the rules below protect
server-rendered HTML and the client bundle size that Core Web Vitals grade.

**Keep `"use client"` on leaf components, never on a page or layout.** Untitled UI
components built on `react-aria-components` need the directive — without it the build fails
outright (`createContext is not a function`). Put it at the top of the component file so the
route stays a Server Component and its content stays in the prerendered HTML. A crawler that
executes no JavaScript must still see the full page.

**Don't widen `sideEffects` in `packages/ui/package.json`.** It is `["**/*.css"]`, which tells
bundlers every JS module in the package is side-effect free. That is what lets the barrel in
`src/index.ts` re-export client components without dragging them into the browser bundle:
importing only `cx` from `@unite/ui` in a Server Component ships no `react-aria` (measured —
1.3M of client chunks versus 1.4M once a `Button` is actually rendered). Setting it to `true`
or deleting it degrades tree-shaking silently, with no error and no failing test.

Because of that, deep imports are **not** required — `import { Button, cx } from "@unite/ui"`
is fine. Don't split the barrel into a separate `components.ts` to "protect" server code;
the boundary already holds.

**Prefer a plain `<button>` for static chrome.** Untitled UI's `Button` earns its weight
wherever press handling, focus rings, loading state or the `href` link variant are used. On
non-interactive marketing furniture it is pure hydration cost, which pressures INP.

## Function declarations over arrow function variables

**Declare functions with `function`, not by assigning an arrow to a `const`.**
`const foo = () => {}` does not declare a function — it declares a variable that happens
to hold an anonymous function. `function foo() {}` declares a function: it hoists, so
call order in a module stops mattering, and it always carries its own name rather than
borrowing one from the binding via JS name inference.

```ts
// Yes
export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

// No
export const formatPrice = (cents: number) => {
  return `$${(cents / 100).toFixed(2)}`
}
```

React components follow the same rule — `function Button(props: ButtonProps)`, never
`const Button = (props: ButtonProps) => {}`. This includes components whose body is a
single JSX expression.

Arrow functions are still correct in the positions where no function is being *declared*:

```ts
items.map((item) => item.id)          // callback
const double = (x: number) => x * 2   // single-expression one-liner
useCallback(() => setOpen(false), []) // inline callback
{ onSelect: () => close() }           // object property
```

The line is whether the function is being *declared* or *passed*. A callback is passed.
A block-bodied arrow bound to a name is a declaration wearing the wrong clothes.

Two things enforce this, because Biome has no built-in `func-style` rule:

- `packages/config-biome/plugins/use-function-declaration.grit` — a GritQL plugin
  covering all block-bodied arrows and function expressions assigned to a `const`.
- `nursery/useReactFunctionComponentDefinition` in `@unite/config-biome/react`, which
  additionally catches expression-bodied React components.

Neither has an autofix, so fix them by hand.

The plugin is declared once, in `@unite/config-biome/base`:

```jsonc
"plugins": ["./node_modules/@unite/config-biome/plugins/use-function-declaration.grit"]
```

Biome resolves a plugin path against the directory of the config that *consumes* the
`extends`, not the directory of the config that declares the path. Because pnpm links
`@unite/config-biome` into the `node_modules` of every package that extends it, that one
relative path resolves correctly from every package. A new package needs no `plugins`
entry of its own — just `extends: ["@unite/config-biome/base"]`.

The one place this cannot work is `packages/config-biome` itself, which has no
`node_modules` link back to itself. **It deliberately has no `biome.json`** and is linted
by the root config instead. Don't add one back — a nested `plugins` array merges with the
inherited one rather than replacing it, so it cannot paper over the broken path.

Verify with `pnpm lint` — an unresolvable plugin surfaces as `Cannot read file.`, not as a
silently skipped rule.

## Agent skills

### Issue tracker

Specs and tickets live as local markdown under `specs/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
