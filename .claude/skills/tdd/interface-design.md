# Interface Design for Testability

Good interfaces make testing natural. Three principles:

1. **Accept dependencies, don't create them.** Pass external dependencies in (dependency injection) rather than instantiating them inside. This lets tests substitute them.

2. **Return results, don't produce side effects.** Functions that return values are trivially testable. Functions that mutate shared state are not.

3. **Small surface area.** Fewer methods = fewer tests needed. If callers only ever use two of five methods, the other three are interface debt.

## The test as design pressure

If a test is awkward to write, the interface is probably wrong. Awkward tests are a signal to redesign the interface, not to work around it with mocks.
