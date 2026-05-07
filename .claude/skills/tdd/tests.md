# What Makes a Good Test

## Good tests (integration-style)

- Tests observable behaviour, not implementation details
- Uses the public interface only
- Survives internal refactors — renaming a private method doesn't break it
- Describes WHAT the system does, not HOW
- One logical assertion per test

## Bad tests (implementation-coupled)

- Mocks internal collaborators
- Tests private methods directly
- Asserts on call counts or call order
- Breaks when you refactor without changing behaviour
- Test name describes HOW, not WHAT
- Verifies through external means instead of the interface

## Example

```typescript
// BAD: Bypasses the interface to verify internal state
test('createUser saves to database', async () => {
  await createUser({ name: 'Alice' })
  const row = await db.query('SELECT * FROM users WHERE name = ?', ['Alice'])
  expect(row).toBeDefined()
})

// GOOD: Verifies through the interface
test('createUser makes user retrievable', async () => {
  const user = await createUser({ name: 'Alice' })
  const retrieved = await getUser(user.id)
  expect(retrieved.name).toBe('Alice')
})
```

The bad test couples to the database schema. If you change the storage layer, the test breaks even though behaviour is identical. The good test survives any internal change that preserves the contract.
