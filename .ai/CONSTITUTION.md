# Project Constitution: library

> **Governing Principles for AI Coding Agents and Software Engineers**  
> *Version:* 1.0.0 | *Last Updated:* 2026-08-18 | *Pragmatism Intensity:* **BALANCED**

---

## 1. Non-Negotiable Core Principles
- 1. Reuse-First Engineering: Search existing workspace components, utilities, and abstractions before creating new ones.
- 2. Pragmatic Simplicity: Prefer standard library and native platform APIs over trivial external dependencies.
- 3. Truthful Verification: Never claim tests passed or security is clear without running deterministic verification commands.
- 4. Explicit Architecture: Respect architectural decisions recorded in ADRs; do not restructure boundaries unprompted.
- 5. Spec-Driven Discipline: All non-trivial features must have an explicit specification, reuse audit, and verified task checklist.

---

## 2. Architectural Guardrails
- Maintain clear separation between domain logic, data access, and presentation layers.
- Prefer cohesive modular monolith patterns over premature distributed microservices.
- Keep dependency graph unidirectional; avoid cyclic imports and tight cross-module coupling.

---

## 3. Security & Compliance Invariants
- Never commit hardcoded API keys, JWT secrets, passwords, or private certificates.
- Always parameterize database queries; reject raw SQL string concatenation.
- Validate and sanitize all untrusted user inputs at trust boundaries.

---

## 4. Quality & Verification Standards
- Every pull request / feature must include targeted unit/integration tests.
- Keep functions small and focused on a single responsibility.
- Maintain zero TypeScript/linter errors on modified files.

---

## 5. Explicitly Banned Anti-Patterns
- Micro-package bloat (e.g. is-odd, left-pad, is-number).
- Blindly wrapping native browser/platform APIs with heavy custom abstractions.
- Fabricating or bypassing test verification steps.

---

*This constitution is enforced by Tailor. All specifications, technical plans, and agent implementations must strictly comply.*
