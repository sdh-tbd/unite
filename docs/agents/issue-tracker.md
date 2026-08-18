# Issue tracker: Local Markdown

Specs and tickets for this repo live as markdown files under `specs/`. There is no remote
tracker — do not use `gh issue` for spec or ticket work.

> **These paths are authoritative.** Some vendored skills (notably `to-tickets` and
> `wayfinder`) write default paths such as `.scratch/` and `issues/` inline in their own
> skill files. Those defaults are **overridden by this document**. When the two disagree,
> this document wins.

## Layout

```
specs/
  <feature-slug>/
    spec.md                       # the spec
    tickets/
      01-<ticket-slug>.md         # one file per ticket
      02-<ticket-slug>.md
  archive/
    <feature-slug>/               # completed specs, moved whole
```

## Conventions

- One feature per directory: `specs/<feature-slug>/`.
- The spec is `specs/<feature-slug>/spec.md`.
- Tickets are one file per ticket at `specs/<feature-slug>/tickets/<NN>-<ticket-slug>.md` —
  never a single combined tickets file.
- `tickets/` is used rather than the upstream default `issues/`. It matches the name of the
  skill that produces them, and avoids the word "issues", which in this repo refers only to
  GitHub.
- Ticket numbers are zero-padded and start at `01`. **Tickets are ordered by dependency, with
  blockers first** — the numeric order is the work queue. Zero-padding keeps lexical sort
  correct past `10`.
- Blocking is recorded as a `Blocked by: NN, NN` line near the top of a ticket. A ticket is
  unblocked when every ticket it lists is done.
- Status is recorded as a `Status:` line near the top of each ticket file.
- Comments and conversation history append to the bottom of the file under a `## Comments`
  heading.

Active specs are the `spec.md` files exactly one level below `specs/`, which naturally
excludes `specs/archive/`.

## When a skill says "publish to the issue tracker"

Write a new file under `specs/<feature-slug>/`, creating the directory if needed.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The developer will normally pass the path or the ticket
number directly.

## Ticket template

Every ticket file carries its own completion instructions, so the instruction travels with the
ticket and is visible to a fresh session that opens it without having read this document.

```markdown
# <NN> — <Ticket title>

Spec: ../spec.md
Status: todo
Blocked by: <NN, NN — or "none">

## Context

<Why this ticket exists, and what the implementing session needs to know.>

## Acceptance criteria

- [ ] <criterion>
- [ ] <criterion>

## On completion

1. Tick every acceptance criterion above.
2. Set `Status: done` at the top of this file.
3. Check the sibling tickets in this directory. If this was the **last** one not yet
   `done`, move the whole spec directory to `specs/archive/<feature-slug>/` in the same
   commit.
```

## Lifecycle

A ticket moves `todo` → `in-progress` → `done`. The implementing session sets the status
itself; there is no separate publish or close step.

When the final ticket in a spec is completed, that same session archives the spec by moving
`specs/<feature-slug>/` to `specs/archive/<feature-slug>/` intact. Nothing is deleted — the
full spec and all its tickets remain readable, and the git history retains the whole story.

## Wayfinding operations

`/wayfinder` keeps its **own separate storage** and does not use `specs/`. Its artifact is a
map, not a spec, and filing it under `specs/` would misname it. Follow the paths in the
`wayfinder` skill itself.
