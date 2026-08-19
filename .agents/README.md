# AI agent configuration

Shared skills and MCP servers for this repo. Configured for **GitHub Copilot CLI**, which
reads `.agents/` natively, with symlinks so **Claude Code** picks up the exact same files.

## Layout

```
.agents/skills/<name>/SKILL.md        # canonical location for skills
.claude/skills  -> ../.agents/skills  # symlink, so Claude Code sees the same skills
.mcp.json                             # MCP servers (read by both Copilot CLI and Claude Code)
```

Custom agents and Copilot CLI hooks belong under `.agents/agents/` and `.agents/hooks/` when
they are added, each with a matching `.claude/` symlink.

Nothing is duplicated — there is exactly one copy of every skill, and no agent configuration
lives in `.github/`. See [`AGENTS.md`](../AGENTS.md) for why it must stay that way. (`.github/`
itself is fine for Actions workflows and other GitHub metadata — just not for skills, agents,
or hooks.)

## Installed skills

| Skill | Source |
| --- | --- |
| `react-best-practices`, `composition-patterns` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| `next-best-practices`, `next-cache-components` | [vercel-labs/openreview](https://github.com/vercel-labs/openreview) (`.agents/skills/`) |
| `turborepo` | [vercel/turborepo](https://github.com/vercel/turborepo) (`skills/`) |
| `sanity-best-practices`, `sanity-migration`, `content-modeling-best-practices`, `content-experimentation-best-practices`, `portable-text-serialization`, `portable-text-conversion`, `seo-aeo-best-practices` | [sanity-io/agent-toolkit](https://github.com/sanity-io/agent-toolkit) |
| `better-auth-best-practices`, `better-auth-security-best-practices`, `create-auth`, `email-and-password-best-practices`, `organization-best-practices`, `two-factor-authentication-best-practices` | [better-auth/skills](https://github.com/better-auth/skills) |
| `grill-with-docs`, `to-spec`, `to-tickets`, `implement`, `tdd`, `wayfinder`, `domain-modeling`, `code-review`, `grill-me`, `handoff` | [mattpocock/skills](https://github.com/mattpocock/skills) |
| `grilling`, `research`, `codebase-design`, `prototype`, `setup-matt-pocock-skills` | [mattpocock/skills](https://github.com/mattpocock/skills) — dependencies of the above |
| `new-feature` | This repo — the guided path through the skills above |

The Better Auth skills live in a nested plugin layout upstream (`security/` at the root, the
rest under `better-auth/`) and are flattened here, one directory per skill named after its
frontmatter `name`. Their file contents are unmodified. The upstream `better-auth/commands/`
slash commands (`providers`, `explain-error`) are **not** vendored — this repo keeps its
prompts as skills.

Skills with `disable-model-invocation: true` in their frontmatter (`grill-me`,
`grill-with-docs`, `handoff`, `implement`, `new-feature`, `setup-matt-pocock-skills`,
`to-spec`, `to-tickets`, `wayfinder`) are **not** auto-loaded by the model. Invoke them
explicitly as slash commands, e.g. `/grill-me`.

`next-best-practices` is the reverse — it sets `user-invocable: false`, so the model loads it
automatically when relevant but you cannot call it as a slash command.

Run `/setup-matt-pocock-skills` once to teach the Matt Pocock skills about this repo's issue
tracker and label vocabulary — `to-spec` and `wayfinder` depend on it. (The `triage` skill it
also configures is not installed here, so that section is skipped.)

### Where to start

`/new-feature` is the entry point for any new feature, bug fix, or refactor. It walks the path
— grill, size, spec, tickets, implement — printing the next command at each step rather than
leaving you to remember the order. See [`docs/agents/issue-tracker.md`](../docs/agents/issue-tracker.md)
for where its specs and tickets land.

### Deliberate divergences from upstream

These differ from the vendored Matt Pocock skills on purpose. Do not "fix" them when
re-vendoring:

- **`specs/` instead of `.scratch/`** — specs are a durable, reviewable artifact, not scratch.
- **`tickets/` instead of `issues/`** — matches the skill that produces them, and keeps the
  word "issues" meaning GitHub Issues only.
- **Lifecycle instructions in the ticket template** — a ticket marks itself done and archives
  the spec when it is the last one. This lives in the template, not in a forked `implement`,
  so `implement` stays byte-identical to upstream.

`to-tickets` and `wayfinder` write their old defaults inline in their own skill files.
`docs/agents/issue-tracker.md` overrides them and says so explicitly.

## MCP servers

### Context7 (`https://mcp.context7.com/mcp`)

Up-to-date library documentation. `.mcp.json` reads the key from the `CONTEXT7_API_KEY`
environment variable — Copilot CLI expands `${VAR}` in header values, so no secret is
committed:

```json
"headers": { "Authorization": "Bearer ${CONTEXT7_API_KEY}" }
```

Get a key at [context7.com](https://context7.com/dashboard) and export it from your shell,
e.g. in `~/.zsh-secrets` sourced by `~/.zshrc`:

```bash
export CONTEXT7_API_KEY=ctx7sk-...
```

**If the variable is unset**, the literal `${CONTEXT7_API_KEY}` is sent and Context7 replies
`Invalid API key`. Without a key, delete the `headers` block — Context7 works unauthenticated
at a lower rate limit.

### Sanity (`https://mcp.sanity.io`)

Authenticates over OAuth on first use, so a browser is required. Start Copilot CLI
interactively and approve the sign-in prompt when the server connects; it will fail with
`401 Missing Authorization header` in non-interactive (`-p`) runs until you have done so.

Alternative if OAuth does not complete: `npx sanity@latest mcp configure`.

### Next.js devtools (`npx next-devtools-mcp@latest`)

Local stdio server, no credentials. Exposes the running dev server's route/component graph and
version-matched Next.js docs, plus browser evaluation against the dev server.

## Pre-commit checks

`.husky/pre-commit` runs Biome over staged files plus `turbo run check-types`. It is
deterministic and offline — no LLM, no network. Bypass it with `SKIP_HOOKS=1 git commit`.

There is deliberately no automated agentic review hook. An earlier three-tier setup
(a Copilot `preToolUse` commit gate plus a headless pre-push reviewer) was removed: the
`preToolUse` gate is fail-closed across *every* shell call, so a bug in it bricks the session,
and it only ever bound agents running inside Copilot CLI. If this comes back, it should be
advisory at push time rather than blocking at commit time.

## Updating a skill

Skills are vendored (copied), not submoduled. To update, re-copy the directory from upstream:

```bash
git clone --depth 1 https://github.com/vercel-labs/agent-skills /tmp/agent-skills
rm -rf .agents/skills/react-best-practices
cp -R /tmp/agent-skills/skills/react-best-practices .agents/skills/react-best-practices
```

Keep the directory name identical to the `name:` field in the skill's frontmatter — Copilot
CLI expects them to match.
