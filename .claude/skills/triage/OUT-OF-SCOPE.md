# Out-of-Scope Records

The `.out-of-scope/` directory stores persistent records of rejected feature requests. One file per **concept** (not per issue).

## When to check

During triage, read all `.out-of-scope/` files. Match by concept similarity, not keyword. Surface any match to the maintainer — they confirm, reconsider, or disagree before you proceed.

## When to write

Only when an **enhancement** (not a bug) is rejected as `wontfix`. 

1. Check if a concept file already exists for this category of request.
2. If yes — append to it. If no — create it.
3. Post a comment on the issue referencing the `.out-of-scope/` file, then close with `wontfix`.

Do not write `.out-of-scope/` entries for bugs. Bugs are either fixed or documented as known limitations elsewhere.

## File naming

Kebab-case, recognizable without opening: `dark-mode.md`, `plugin-system.md`, `offline-support.md`.

## File format

```markdown
# {Concept name}

{Why this was rejected — the reasoning, not just the decision. Include constraints
not visible in the code, trade-offs considered, and what would need to change for
this to be reconsidered.}

## Prior requests

- #{issue number} — {one-line summary}
```
