---
name: setup-matt-pocock-skills
description: Sets up an `## Agent skills` block in CLAUDE.md and `docs/agents/` so the engineering skills know this repo's issue tracker (GitHub or local markdown), triage label vocabulary, and domain doc layout. Run before first use of `to-issues`, `to-prd`, `triage`, `diagnose`, `tdd`, `improve-codebase-architecture`, or `zoom-out` — or if those skills appear to be missing context about the issue tracker, triage labels, or domain docs.
disable-model-invocation: true
---

# Setup Matt Pocock Skills

Seed per-repo config so the engineering skills work correctly in this repository.

## Process

### 1. Explore

Run `git remote -v`. Read `CLAUDE.md` (or `AGENTS.md`), `CONTEXT.md`, `docs/adr/`, `docs/agents/`, `.scratch/` if they exist.

### 2. Present findings and ask

Walk the user through three decisions, one at a time:

**Section A — Issue tracker**: Where do issues live?
- GitHub Issues (gh CLI)
- GitLab Issues (glab CLI)
- Local markdown (`.scratch/`)
- Other

**Section B — Triage label vocabulary**: Map the five canonical roles to this repo's actual label strings:
- `needs-triage`
- `needs-info`
- `ready-for-agent`
- `ready-for-human`
- `wontfix`

**Section C — Domain docs**: How is domain knowledge organized?
- Single-context (`CONTEXT.md` + `docs/adr/` at repo root)
- Multi-context (`CONTEXT-MAP.md` at root, per-context `CONTEXT.md` files)

### 3. Confirm and edit

Show a draft of the `## Agent skills` block and the `docs/agents/` file contents before writing.

### 4. Write

- Edit `CLAUDE.md` if it exists, else `AGENTS.md`, else ask. Never create one when the other exists.
- Write `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`.

### 5. Done

Tell the user which skills now read from these files.

## `## Agent skills` block format

Add this block to `CLAUDE.md`:

```markdown
## Agent skills

### Issue tracker
[one-line summary]. See `docs/agents/issue-tracker.md`.

### Triage labels
[one-line summary]. See `docs/agents/triage-labels.md`.

### Domain docs
[one-line summary — "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```
