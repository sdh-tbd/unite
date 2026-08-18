---
name: new-feature
description: The guided path from an idea to shipped code — grill it, size it, spec it, split it into tickets, implement it. Start here for any new feature, bug fix, or refactor.
disable-model-invocation: true
---

The developer has described a piece of work. Your job is to walk them along the path from that
description to shipped code, **in order**, without them having to remember which skill comes
next.

You do not replace any step, and you do not skip the human. The developer still answers every
grilling question and still approves the spec. This skill exists so the *path* is not something
each person has to know by heart.

## The path

```
/new-feature
   └─ grilling (+ domain-modeling, + advisory skills for the situation)
        └─ size it
             ├─ one session   ──────────────────────────► /implement
             └─ several sessions ──► /to-spec ──► /to-tickets ──► /implement (per ticket)
```

## Critical: how you hand off

You run **only the grilling phase** yourself. `/to-spec`, `/to-tickets` and `/implement` are
user-invoked skills, and a user-invoked skill must never invoke another user-invoked skill.

So at the end of each phase, **end your turn by printing the exact command for the developer to
type next**, in a fenced block, on its own. Then stop. Do not continue past it, and do not
paraphrase it — print the literal slash command.

Everything up to and including `/to-tickets` must happen in **one unbroken context window**, so
the spec and the tickets are written by someone who sat through the grilling. Tell the
developer plainly: **do not `/compact` or `/clear` until `/to-tickets` has finished.** Only
`/implement` is meant to start from a fresh session.

## Step 1 — Identify the situation

Infer the situation from the developer's opening description. Do not demand it as an argument.
State which one you think it is and why, in one line, and let them correct you.

| Situation | Looks like |
| --- | --- |
| **Feature** | New capability. Nothing is broken; something is missing. |
| **Bug fix** | Existing code behaves wrongly. There is a reproduction, or there should be. |
| **Refactor** | Behaviour stays the same; structure or dependencies change. Often triggered by a major version upgrade. |

If the description is genuinely ambiguous, ask — once.

## Step 2 — Load the advisory skills for that situation

Before grilling, consult the skills that make your questions sharper. These are advisory: read
them for context, do not run them as their own phase. Load only what the work actually touches.

**Always:** `codebase-design` — for the vocabulary of seams, module depth, and where a boundary
belongs.

| Situation | Also consult |
| --- | --- |
| **Feature** | `next-best-practices` and `react-best-practices` if it touches the web app; `composition-patterns` if it adds shared components; `sanity-best-practices` and `content-modeling-best-practices` if it touches content or schemas; `seo-aeo-best-practices` if it adds public pages; `turborepo` if it adds or rewires a package. |
| **Bug fix** | The best-practice skill for whatever the bug is made of — `react-best-practices` for render loops and stale state, `next-best-practices` for caching and RSC boundaries, `sanity-best-practices` for GROQ and schema faults. A bug is very often a best practice that was skipped. |
| **Refactor** | `turborepo` for anything crossing package boundaries. For a version upgrade, **use Context7 to pull the current docs and the official migration guide first** — grill against what the new version actually says, not against what you remember of the old one. |

If a question turns on a fact you are not certain of, use `research`. If it turns on whether a
design *feels* right, use `prototype`. Both are model-invocable, so you may run them directly.

## Step 3 — Grill

Run the `grilling` skill, using `domain-modeling` alongside it, exactly as `/grill-with-docs`
does. Record terminology in the glossary and decisions as ADRs as you go.

Grill until the frontier is empty — until you have no unanswered questions that would change
the shape of the work. Do not stop early because the developer sounds convinced.

## Step 4 — Size it

When grilling concludes, say how big the work looks and why. The developer decides; you
recommend.

- **One session** — a handful of files, one seam, no open questions, and you can hold the whole
  thing in context at once.
- **Several sessions** — multiple seams, work that must land in a dependency order, or more
  detail than one context window will survive.

If you are torn, say so and give the deciding factor rather than picking silently.

### If it is one session

Skip the spec and the tickets. There is nothing for a spec to buy you when the work fits in the
context you are already holding.

End your turn with:

```
/implement
```

### If it is several sessions

End your turn with:

```
/to-spec
```

...and remind them not to compact the session yet.

## Step 5 — After the spec

Once `/to-spec` has published to `specs/<slug>/spec.md` and the developer is happy with it, the
next command is:

```
/to-tickets
```

This is the last step that needs the grilling context. After it completes, the session is free.

## Step 6 — Implement

Tickets are numbered in dependency order — that order is the queue. Take the lowest-numbered
ticket that is not `done` and whose blockers are all `done`.

Each ticket gets **its own fresh session**:

```
/implement specs/<slug>/tickets/01-<ticket-slug>.md
```

Each ticket marks itself done when finished, and the session that completes the last one
archives the whole spec directory. Those instructions live in the ticket file, so a fresh
session picking up a ticket cold will find them without reading anything else.

If a session runs out of room part-way through a ticket, use `/handoff` before it does, so the
next one picks up cleanly rather than re-deriving what was already decided.

## When the fog is too thick to spec

Sometimes grilling ends with the shape still unclear — not because the questions were bad, but
because the answers depend on things nobody knows yet. That is not a spec; that is a research
programme.

Say so, and route to `wayfinder`, which maps the work as *decision* tickets and resolves them
one at a time until the way is clear. Wayfinder plans; it does not build. When the fog lifts,
come back and rejoin the path at `/to-spec`.

```
/wayfinder
```
