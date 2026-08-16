---
name: architecture
description: Guides architectural decisions, ADR maintenance, system boundaries, and prevents accidental architectural drift or premature complexity.
---

# Architecture Skill

Activate this skill when evaluating system boundaries, designing new subsystems, restructuring modules, or maintaining Architecture Decision Records (ADRs).

---

## 1. ADR Format Standard (`.ai/DECISIONS.md`)

When an architectural decision is made, record it using this standard structure:

```markdown
## ADR-00X — [Short Title]
**Status:** Accepted | Proposed | Deprecated | Superseded  
**Date:** YYYY-MM-DD  

### Context
What problem are we trying to solve and what constraints exist?

### Decision
What specific technology, pattern, or structure are we adopting?

### Tradeoffs & Alternatives Considered
- **Option A:** Pros / Cons / Why rejected
- **Option B (Selected):** Pros / Cons / Risks

### Evidence
References to configuration files, benchmarks, or requirements.
```

---

## 2. Preventing Architectural Drift

* **Modular Monolith First:** For small-to-medium systems, prefer cohesive modules over distributed microservices.
* **Separation of Concerns:** 
  - Controllers / Route Handlers: Handle HTTP parsing, request validation, and status codes.
  - Domain Services: Pure business logic, authorization rules, and workflows.
  - Data Repositories / Models: Database transactions and queries.
* **Reject Premature Complexity:** Push back against introducing message brokers, multi-region clusters, or distributed caches unless verifiable traffic or reliability requirements necessitate them.
