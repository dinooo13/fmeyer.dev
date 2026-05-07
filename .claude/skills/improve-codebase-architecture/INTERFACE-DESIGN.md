# Interface Design: Design It Twice

When designing a non-trivial interface, run multiple sub-agents in parallel with different constraints before committing to one shape.

## Process

1. **Frame the problem space** — write a user-facing explanation with constraints, dependencies, and an illustrative code sketch.

2. **Spawn 3+ sub-agents in parallel**, each with a different design constraint:
   - Agent 1: "Minimise the interface — aim for 1–3 entry points max."
   - Agent 2: "Maximise flexibility — support many use cases and extension."
   - Agent 3: "Optimise for the most common caller — make the default case trivial."
   - Agent 4 (if cross-seam dependencies exist): "Design around ports & adapters."

3. **Present and compare** designs by **depth**, **locality**, and **seam placement**. Give a recommendation with reasoning.

## Goal

Arriving at the first plausible interface and running with it is the most common interface design mistake. Generating genuinely different alternatives forces the trade-offs into the open before they're locked in.
