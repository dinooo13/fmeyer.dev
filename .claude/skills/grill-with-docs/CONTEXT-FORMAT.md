# CONTEXT.md Format

## Structure

```md
# {Context Name}

{One or two sentence description.}

## Language

**Order**:
{A concise description of the term}
_Avoid_: Purchase, transaction

## Relationships

- An **Order** produces one or more **Invoices**

## Example dialogue

> **Dev:** ...
> **Domain expert:** ...

## Flagged ambiguities

- "account" was used to mean both **Customer** and **User** — resolved: these are distinct concepts.
```

## Rules

- Be opinionated. Flag conflicts in "Flagged ambiguities."
- Keep definitions tight — one sentence max per term.
- Show relationships between terms explicitly.
- Only include terms specific to this project's context — not generic programming vocabulary.
- Write an example dialogue that shows the terms in use.

## File placement

- **Single context**: one `CONTEXT.md` at the repo root.
- **Multiple contexts**: `CONTEXT-MAP.md` at root listing contexts, where they live, and how they relate. Each context has its own `CONTEXT.md` and `docs/adr/`.

Create files lazily — only when you have something to write.
