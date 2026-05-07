# Domain Docs Reference

Before exploring the codebase, read: `CONTEXT.md` (or `CONTEXT-MAP.md`) and relevant ADRs in `docs/adr/`. Proceed silently if they don't exist.

## File structure

**Single-context** (most repos):
```
/CONTEXT.md
/docs/adr/
```

**Multi-context** (monorepos or bounded-context architectures):
```
/CONTEXT-MAP.md
/<context-a>/CONTEXT.md
/<context-a>/docs/adr/
/<context-b>/CONTEXT.md
/<context-b>/docs/adr/
```

## Usage

- Use the glossary's vocabulary in all output — issue titles, PR descriptions, agent briefs.
- Flag ADR conflicts explicitly rather than silently overriding past decisions.
- Create `CONTEXT.md` or `docs/adr/` lazily — only when you have something to write.
