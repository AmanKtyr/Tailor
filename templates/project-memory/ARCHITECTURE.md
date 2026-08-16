# System Architecture

## Architecture Overview
- **System Style:** {{ARCHITECTURE_STYLE}}
- **Primary Runtime:** {{RUNTIME}}
- **API Style:** {{API_STYLE}}

## Architectural Principles
1. **Separation of Concerns:** Keep business logic separated from presentation and I/O handlers.
2. **Reuse-First Ladder:** Existing Project Code -> Shared Abstraction -> Framework Native -> Existing Dependency -> Trusted New Dependency -> Custom Code.
3. **Type Safety:** Maintain strict typing without unnecessary escape hatches (`any`).
4. **Deterministic Testing:** Test units and critical integration paths deterministically.
