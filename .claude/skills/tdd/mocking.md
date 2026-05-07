# Mocking

## Mock at system boundaries only

Appropriate mock targets:
- External APIs and third-party services
- Databases (sometimes — prefer a test DB or in-memory substitute)
- Time and randomness
- File system (sometimes — prefer a temp directory)

Do **not** mock:
- Your own classes or modules
- Internal collaborators

Mocking internals couples tests to implementation. When you refactor, the tests break even though behaviour hasn't changed.

## Designing for mockability

1. **Use dependency injection** — pass external dependencies in rather than importing/instantiating them inside. The seam is then at the module boundary, not buried in implementation.

2. **Prefer SDK-style interfaces over generic fetchers** — one function per external operation, each independently mockable. A generic `fetch(url)` wrapper is hard to mock meaningfully; a `getUser(id)` function is not.
