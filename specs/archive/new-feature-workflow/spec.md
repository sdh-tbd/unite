# New Feature Workflow

**Status:** ready-for-agent

## Problem Statement

Starting a new piece of work in this repo means driving a chain of agent skills in the right
order: grill the idea out, turn the result into a spec, split the spec into tickets, then
implement each ticket. Nothing in the repo encodes that order. The knowledge lives in the
developer's head, and getting it wrong is silent — a spec written before the grilling has
settled looks exactly like a good one.

Three failures follow from that:

1. **Order is forgettable.** Skipping the grilling and going straight to a spec produces a
   confident document built on unmade decisions.
2. **Context is fragile.** The grilling, the spec, and the tickets must share one unbroken
   context window. A `/compact` in the middle silently strands the spec from the reasoning
   that justified it, and nothing warns you.
3. **It doesn't transfer.** Teammates less practised with agentic coding have no way to
   discover the sequence. There is no entry point to point them at.

Separately, the repo's issue tracker is configured for GitHub Issues, but every ticket
operation would then be a network round-trip — needless for a solo working loop, and hostile
to any future script that iterates tickets in a loop.

## Solution

A single user-invoked skill, `/new-feature`, that is the one entry point for starting any
chunk of work — a feature, a bug fix, or a refactor. It runs the grilling phase itself, then
hands the developer the exact next command to type, phase by phase, until tickets exist on
disk.

It does not remove the human from any step. Every constituent skill keeps its own approval
gate — the grilling ends only when the developer confirms shared understanding, the spec
confirms its seams, the tickets confirm their granularity. What the skill removes is the need
to *remember what comes next*, and the risk of the phases drifting out of a shared context.

Alongside it, the issue tracker moves from GitHub Issues to markdown files under `specs/`,
committed to the repo. Tickets become local files that carry their own completion
instructions, so any fresh session that opens one knows how to close it out.

## User Stories

1. As a developer, I want a single command that starts any new piece of work, so that I don't
   have to remember which skill comes first.
2. As a developer, I want `/new-feature` to accept my rough idea inline, so that I can start
   without first composing a formal description.
3. As a developer, I want the skill to grill me before anything is written down, so that the
   spec is built on decisions I actually made.
4. As a developer, I want the grilling to use the project's domain vocabulary, so that the
   terms in my tickets match the terms in the codebase.
5. As a developer, I want the skill to recognise whether I'm starting a feature, a bug fix, or
   a refactor, so that the questions I'm asked suit the situation.
6. As a developer fixing a bug in React code, I want the relevant React and composition skills
   consulted during grilling, so that the diagnosis accounts for framework rules I might not
   recall.
7. As a developer planning a major version upgrade, I want current upstream documentation
   pulled in during grilling, so that the plan reflects the actual migration path rather than
   my memory of it.
8. As a developer, I want the skill to tell me when the work is small enough for one session,
   so that a two-line change doesn't acquire a spec and a ticket queue.
9. As a developer, I want to make the final call on whether work is one session or many, so
   that the agent's estimate doesn't silently commit me to ceremony I don't want.
10. As a developer, I want `/implement` to stay a command I type myself, so that no agent
    starts writing code without my explicit go-ahead.
11. As a developer, I want each phase to end by printing the exact next command, so that I
    never have to look up what follows.
12. As a developer, I want the whole planning chain to run in one session, so that the spec and
    tickets are grounded in the grilling that produced them.
13. As a developer, I want to be warned not to compact or clear before tickets exist, so that I
    don't destroy the shared context by accident.
14. As a teammate new to agentic coding, I want one discoverable entry point in the slash
    command list, so that I can follow the project's process without being taught it.
15. As a teammate, I want the skill to explain what it's about to do at each phase, so that I
    understand the process while using it.
16. As a developer, I want specs and tickets stored as files in the repo, so that planning
    works offline and without authenticating to anything.
17. As a developer, I want every spec in a predictable directory, so that I can find prior
    planning without searching.
18. As a developer, I want tickets numbered in dependency order, so that reading them top to
    bottom gives a valid build order.
19. As a developer, I want ticket numbers zero-padded, so that a lexical sort stays correct
    past ten tickets.
20. As a future script author, I want the ticket queue to be plain sorted files with an
    explicit status, so that I can iterate it in a loop without parsing prose.
21. As an implementing agent in a fresh session, I want the ticket file to tell me how to mark
    it complete, so that I don't need to have read any other document first.
22. As a developer, I want a completed ticket to record its own completion, so that the queue
    reflects reality without my intervention.
23. As a developer, I want the session that finishes the last ticket to archive the spec, so
    that the active spec list only ever shows live work.
24. As a developer, I want archived specs kept whole, so that a finished spec and its tickets
    stay readable together.
25. As a developer, I want the spec and its tickets committed to git, so that the planning
    history survives independently of any external service.
26. As a developer, I want `specs/` to be a visible, plainly named directory, so that nothing
    about its name suggests the contents are disposable.
27. As a developer, I want the tracker documentation to state the layout authoritatively, so
    that agents follow this repo's paths rather than the defaults baked into vendored skills.
28. As a developer, I want `wayfinder` to keep its own storage, so that exploratory maps aren't
    filed as though they were specs.
29. As a developer, I want the repo's agent documentation to match what is actually installed,
    so that I don't debug against a description of something that no longer exists.
30. As a developer, I want a test runner wired up and proven, so that the skills that instruct
    running tests are not inert.
31. As a developer, I want the test runner reachable through the existing task runner, so that
    it participates in the same pipeline as the other checks.
32. As a developer, I want the deliberate divergences from the upstream skill collection
    recorded, so that a future update doesn't mistake them for bugs.

## Implementation Decisions

### The skill

- One skill, `/new-feature`, replaces the idea of separate per-situation skills. It branches
  internally on **situation** — feature, bug fix, or refactor — because the branches differ
  only in which advisory skills they consult, which is data rather than a distinct pipeline.
- The situation is inferred from the developer's opening description and confirmed rather than
  demanded as an argument.
- Each situation carries a list of advisory skills to consult during grilling. This list is
  expressed as a routing table, following the pattern already established by the repo's
  `review-changes` agent, which routes a diff to only the skills the changed paths warrant.
- The skill is user-invoked only (`disable-model-invocation: true`), matching every other
  flow-critical skill in the collection.

### Phase sequencing — the baton pass

- `/new-feature` runs the grilling phase directly, in the current session, invoking the
  `grilling` and `domain-modeling` skills. Both are model-invocable, so this requires no
  divergence from the upstream convention that a user-invoked skill never invokes another
  user-invoked skill.
- For the phases that follow, the skill **ends its turn by printing the exact next command**
  for the developer to type — `/to-spec`, then `/to-tickets`, then `/implement`. Those three
  are user-invoked skills, and typing them keeps the invocation genuinely user-initiated.
- Because the developer types the next command in the same session, the grilling, spec, and
  tickets all share one unbroken context window, satisfying the upstream requirement without
  any architectural exception.
- The skill explicitly warns against compacting or clearing the session before `/to-tickets`
  has completed.

### Sizing

- After grilling concludes, the skill states whether the work looks like a single session or
  several, with its reasoning, and the developer decides.
- Single-session work skips the spec and ticket phases and goes straight to a prompt to run
  `/implement`.
- Multi-session work proceeds to `/to-spec`.
- `/implement` is never invoked automatically in either branch.

### Issue tracker

- The tracker changes from **GitHub Issues** to **local markdown**, and
  `docs/agents/issue-tracker.md` is rewritten accordingly. `AGENTS.md` is updated to match.
- Layout:
  - `specs/<slug>/spec.md` — the spec
  - `specs/<slug>/tickets/<NN>-<ticket-slug>.md` — one file per ticket
  - `specs/archive/<slug>/` — completed specs, moved whole
- `tickets/` is used rather than the upstream default of `issues/`. It matches the name of the
  skill that produces them, and avoids the word "issues", which in this repo now refers only
  to GitHub.
- Ticket numbering keeps the upstream convention: zero-padded, starting at `01`, ordered by
  dependency with blockers first. The ordering is the queue.
- Active specs are enumerated as the spec files one level below `specs/`, which naturally
  excludes the archive directory.
- The tracker doc states these paths authoritatively and notes that they override the default
  paths written inline in the vendored `to-tickets` skill, so an agent reading both knows
  which wins.
- `wayfinder` retains its own separate storage. Its artifact is a map, not a spec, and filing
  it under `specs/` would misname it.

### Ticket lifecycle

- The ticket file template carries its own completion instructions, so the instruction travels
  with the ticket and is visible to any fresh session that opens one — including a looped
  session that never read the tracker documentation.
- On completing a ticket, the implementing session ticks the acceptance criteria and sets the
  ticket's status to done.
- The same session then checks its sibling tickets. If it has just completed the last open
  one, it moves the whole spec directory into the archive in the same commit.
- This is placed in the template rather than in the `implement` skill, because `implement` is
  vendored verbatim from upstream and forking it would cause drift on the next update.

### Documentation corrections

- `.agents/README.md` currently documents a three-tier review pipeline — a `preToolUse` commit
  gate, a pre-push agentic review, `pnpm review` and `pnpm review:accept` scripts, and several
  environment escape hatches. None of the referenced scripts or hook definitions exist. The
  README section is corrected to describe only what is present.
- The README's installed-skills table is updated to list `implement`, `to-tickets`, and
  `new-feature`.
- The deliberate divergences from upstream — `tickets/` instead of `issues/`, the added
  lifecycle instructions in the ticket template, `specs/` instead of `.scratch/` — are recorded
  so a future re-vendoring recognises them as intentional.

### Testing infrastructure

- Vitest is added at the repo root and wired into the existing task runner, with a `test` task
  alongside the current lint and type-check tasks.
- Its purpose here is scaffolding: the `implement` and `tdd` skills both instruct running
  tests, which is currently inert because no runner exists.

## Testing Decisions

A good test here exercises externally observable behaviour and does not assert on internal
structure. That principle is easy to state and, for this spec, almost entirely unexercisable —
which is worth being explicit about rather than papering over.

**This spec has essentially no testable logic.** Four of its five artifacts are markdown
consumed by a language model: the skill, the tracker documentation, `AGENTS.md`, and the
README. There is no meaningful unit seam in prose. An earlier draft of this work included a
publishing job with real branching logic, which would have offered a genuine seam; that has
been cut, and the seam went with it.

The single seam is therefore the **test setup itself**:

- One smoke test proves the runner is correctly wired — that the `test` task is discoverable
  through the task runner, that the runner resolves its configuration, and that a failing
  assertion actually fails the task rather than passing silently. A test runner that reports
  success when nothing ran is the specific failure this guards against.

Everything else is verified by **use**, not by assertion:

- The skill is validated by running `/new-feature` end to end once on a real piece of work and
  confirming each phase hands off correctly.
- The tracker layout is validated by `/to-tickets` writing to the intended paths.
- The ticket lifecycle is validated by completing a ticket and confirming it marks itself done,
  and by completing a final ticket and confirming the spec directory is archived.

There is no prior art for tests in this repo — no runner, no test files, no test task existed
before this spec. This establishes the prior art rather than following it.

## Out of Scope

- **The GitHub Actions job** that would have mirrored archived specs into GitHub Issues,
  together with the `spec-id` marker scheme and its idempotency handling. Git history is
  accepted as the durable record.
- **A `/publish` skill.** Dropped along with the Action; there is nothing left to publish to.
- **The loop script** that would iterate tickets in fresh sessions. The ticket layout is
  designed to make it straightforward later — sorted, numbered, explicitly statused — but the
  script is not built here.
- **Restoring the review pipeline.** The missing commit gate, pre-push review, and their
  scripts are documented away, not rebuilt. Note that the stale hook registration in the
  current session must be cleared before this work can proceed.
- **The `triage` skill and its labels.** Not installed; `to-tickets` marks its own output
  ready-for-agent, so nothing in this flow needs triage.
- **The `ask-matt` router skill.** `/new-feature` covers the same entry-point role for this
  repo's flow.
- **`CONTEXT.md` and any ADRs.** No glossary exists yet; the domain-modeling skill creates one
  lazily when a term is genuinely resolved.
- **Real application tests.** Vitest is wired and smoke-tested only.
- **Migrating the existing GitHub repository or its remote.** Unrelated to the tracker change.

## Further Notes

- The name `/new-feature` is a slight misnomer for its bug and refactor branches. It was chosen
  over the more accurate `/build` for discoverability: a teammate scanning the slash command
  list should be able to guess what it does without being told.
- The bug and refactor branches should start minimal. Their advisory skill lists are best
  filled in from real use, once it is clear which skills actually get consulted, rather than
  guessed at up front.
- The archive move was originally motivated by giving a CI job something to trigger on. With
  that job cut, it survives purely as organisation — worth remembering if the active spec list
  never grows long enough to need it.
- This spec is filed under the layout it defines, not the GitHub Issues layout that the tracker
  documentation currently specifies. Rewriting that documentation is part of the work.
