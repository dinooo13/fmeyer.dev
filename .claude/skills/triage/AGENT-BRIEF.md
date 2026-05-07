# Agent Brief Format

An agent brief is a structured comment posted on a GitHub issue when it moves to `ready-for-agent`.

## Principles

- **Durability over precision**: Describe interfaces and behavioral contracts, not file paths or line numbers — those go stale.
- **Behavioral, not procedural**: Describe WHAT the system should do after the agent's work, not HOW to implement it.
- **Complete acceptance criteria**: Every agent brief must have concrete, testable criteria.
- **Explicit scope boundaries**: State what is out of scope.

## Template

```markdown
## Agent Brief

**Category:** bug / enhancement
**Summary:** one-line description

**Current behavior:**
[what happens now]

**Desired behavior:**
[what should happen after the agent's work]

**Key interfaces:**
- `TypeName` — what needs to change and why

**Acceptance criteria:**
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2

**Out of scope:**
- Thing that should NOT be changed
```

## What makes a bad brief

- Vague acceptance criteria ("it should work correctly")
- File paths as the primary reference point ("edit line 42 of foo.ts")
- Missing out-of-scope section — agent may over-reach
- Procedural instructions instead of behavioral description
