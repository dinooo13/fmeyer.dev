# Deep Modules

From "A Philosophy of Software Design" (Ousterhout).

**Deep module** = small interface + lots of implementation. High leverage for callers.

**Shallow module** = large interface + little implementation. Avoid — the interface cost nearly equals the implementation benefit.

## Diagnostic questions when designing an interface

- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?

If yes to any of these, the module can be deepened.

## The deletion test

Imagine deleting the module. If complexity vanishes (callers become simpler), the module was earning its keep — it was deep. If complexity just scatters across callers, the module was a pass-through — it was shallow.
