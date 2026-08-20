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

## Agent skills

### Issue tracker

Specs and tickets live as local markdown under `specs/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
