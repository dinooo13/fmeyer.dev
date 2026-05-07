# Architecture Language

Use these terms exactly. Don't drift into "component," "service," "API," or "boundary."

- **Module**: Anything with an interface and an implementation. Scale-agnostic — a function, class, package, or slice all qualify.
- **Interface**: Everything a caller must know to use the module correctly — type signature, invariants, ordering constraints, error modes, config, performance. Not just the type signature.
- **Implementation**: What's inside a module.
- **Depth**: Leverage at the interface — amount of behaviour per unit of interface a caller must learn. Deep = high leverage. Shallow = interface nearly as complex as the implementation.
- **Seam** (from Feathers): Where you can alter behaviour without editing in that place. Use this, not "boundary."
- **Adapter**: A concrete thing satisfying an interface at a seam.
- **Leverage**: What callers get from depth — more capability per unit of interface.
- **Locality**: What maintainers get from depth — change concentrates at one place.

## Key principles

- Depth is a property of the interface, not the implementation.
- **Deletion test**: imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- The interface is the test surface.
- One adapter = hypothetical seam. Two adapters = real seam.
