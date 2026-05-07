# UI Prototype

Generate multiple structurally different UI variations on a single route, switchable via a `?variant=` URL parameter and a floating bottom control bar.

## Two sub-shapes

**Sub-shape A (preferred)**: Variants on an existing route using `?variant=` — preserves real data, auth, and context. Use this when there is a natural host page.

**Sub-shape B (fallback)**: Throwaway route `/prototype/<name>` when no natural host page exists. Use only when Sub-shape A isn't viable.

## Process

1. **State the objective** in one line.

2. **Draft radically different variants** — aim for 3, cap at 5. Structural differences, not cosmetic tweaks (different layout, different information hierarchy, different interaction model — not different colours).

3. **Wire them via `?variant=`** (or `?variant=1`, `?variant=2`, etc.).

4. **Build a floating switcher** — fixed bottom-center, navigation arrows, variant labels, responds to left/right arrow keys, updates URL on switch.

5. **Share the URL** so the user can drive.

6. **Clean up** — delete losing variants and the switcher once a winner emerges. Rewrite the winner properly; don't promote prototype code directly.

## Warnings

- Variants must differ structurally, not just cosmetically
- Keep variants read-only — no real mutations during prototyping
- Rewrite the winner from scratch rather than promoting prototype code
