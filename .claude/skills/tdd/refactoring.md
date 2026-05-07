# Refactoring After TDD

After all tests pass, look for refactor candidates. Never refactor while RED.

## What to look for

- **Duplication** → Extract function or class
- **Long methods** → Break into private helpers
- **Shallow modules** → Combine or deepen (see deep-modules.md)
- **Feature envy** → Move logic to where the data lives
- **Primitive obsession** → Introduce value objects
- **Existing code the new code reveals as problematic** → Address it now while the context is fresh

## Rules

- Run tests after each refactor step — one thing at a time
- Refactoring must not change observable behaviour
- If a refactor makes a test fail, either the refactor changed behaviour (bad) or the test was testing implementation details (fix the test)
