# Deepening a Cluster of Shallow Modules

How to safely deepen shallow modules based on their dependency type.

## Dependency categories

### 1. In-process
Pure computation, no I/O. Always deepenable — merge modules, test through the new interface directly. Old unit tests on the shallow modules become waste — delete them.

### 2. Local-substitutable
Dependencies with local test stand-ins (PGLite for Postgres, in-memory filesystem). Deepenable if a stand-in exists. Tests use the stand-in; production uses the real thing.

### 3. Remote but owned (Ports & Adapters)
Your own services across a network boundary. Define a port at the seam; inject transport as an adapter. Tests use an in-memory adapter; production uses the HTTP/gRPC/queue adapter.

### 4. True external (Mock)
Third-party services you don't control. The deepened module takes the external dependency as an injected port; tests provide a mock adapter.

## Seam discipline

- One adapter = hypothetical seam (you *could* swap it, but haven't needed to).
- Two adapters = real seam (you've actually needed two different implementations).

Don't create seams speculatively. Promote a hypothetical seam to a real one only when the second adapter appears.

## Testing strategy

Replace, don't layer. When you deepen a cluster:

- Old unit tests on the shallow modules → delete them.
- Write new tests at the deepened module's interface.
- Tests assert on observable outcomes, not internal state.
