---
name: architecture
description: Guides architectural decisions, ADR maintenance, boundary preservation, and prevents accidental architectural drift or premature complexity.
---

# Architecture Skill

Activate this skill when designing new system components, handling refactoring across multiple services, evaluating architectural changes, or managing Architecture Decision Records (ADRs).

## 1. Architecture Decision Records (ADRs)
- Maintain all structural choices in `.ai/DECISIONS.md`.
- Format ADRs with: Status, Date, Context, Decision, Tradeoffs, and Evidence.
- Before approving or implementing large changes, check `.ai/DECISIONS.md` to see if a conflicting decision already exists.

## 2. Preventing Premature Complexity
- **Modular Monolith First:** For small-to-medium systems, prefer a well-structured modular monolith over microservices.
- **Explicit Boundaries:** Maintain clear module and domain boundaries with clean interfaces.
- **Challenge Unwarranted Overhauls:** If a user requests splitting a working small app into multiple decoupled services without performance or organizational bottlenecks, present the operational costs (distributed tracing, network latency, data consistency, deployment overhead) and propose clean modularization instead.

## 3. High-Risk Changes Confirmation
- Architectural changes that modify core data structures, protocols, or authentication require an explicit Implementation Proposal with trade-off analysis.
