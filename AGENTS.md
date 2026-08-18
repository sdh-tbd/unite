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

## Agent skills

### Issue tracker

Specs and tickets live as local markdown under `specs/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
