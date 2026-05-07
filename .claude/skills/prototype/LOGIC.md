# Logic Prototype

Build a tiny interactive terminal app that pushes the state machine through cases that are hard to reason about on paper.

## Process

1. **State the question** in one paragraph before writing any code.

2. **Pick the language** — match the host project.

3. **Isolate the logic** in a portable module — pure reducer, state machine, pure functions, or class. Keep it pure: no I/O, no terminal code inside the logic module.

4. **Build the smallest TUI**:
   - Clear screen on every tick
   - Render current state (one field per line, bold/dim for emphasis)
   - Keyboard shortcuts shown at the bottom
   - Loop until quit

5. **Make it runnable in one command** — add to the project's task runner (`pnpm proto`, `python proto.py`, etc.).

6. **Hand it over** — let the user drive. You observe, they interact.

7. **Capture the answer** in `NOTES.md` or equivalent before deleting.

## Anti-patterns

- Don't add tests — the TUI loop is the test
- Don't wire to a real database
- Don't generalise or abstract
- Don't blur logic and TUI code together
- Don't ship the TUI shell to production
