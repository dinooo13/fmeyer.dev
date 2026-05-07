# ADR Format

ADRs live in `docs/adr/` with sequential numbering: `0001-slug.md`, `0002-slug.md`. Create the directory lazily — only when the first ADR is needed.

## Template

```md
# {Short title of the decision}

{1-3 sentences: what's the context, what did we decide, and why.}
```

Optional sections (only when they add genuine value): Status frontmatter, Considered Options, Consequences.

## When to offer an ADR

All three must be true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

Qualifies: architectural shape, integration patterns between contexts, technology choices with lock-in, boundary/scope decisions, deliberate deviations from obvious path, constraints not visible in code, rejected alternatives when rejection is non-obvious.

Does not qualify: implementation details, naming choices with no lock-in, decisions obvious from the code itself.
