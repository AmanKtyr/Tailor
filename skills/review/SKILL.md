---
name: review
description: Guides code and architecture review (/review or tailor review), evaluating duplication, security risks, performance bottlenecks, and adherence to project conventions.
---

# Code & Architecture Review Skill

Activate this skill when reviewing code changes, pull requests, or conducting a project-wide health review (`/review` or `tailor review`).

## 1. Review Categories
Evaluate changes across:
1. **Architecture & Boundaries:** Does this violate established ADRs in `.ai/DECISIONS.md`?
2. **Reuse & Duplication:** Could this have reused existing components, utilities, or abstractions?
3. **Dependencies:** Are there unneeded packages or supply-chain security concerns?
4. **Security:** Are inputs validated? Are secrets protected? Are queries parameterized?
5. **Testing & Quality:** Are there targeted unit/integration tests covering new logic?

## 2. Actionable Findings Structure
Prioritize signal over noise. Structure findings clearly:
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW / INFO
- **Location:** File and line number
- **Problem:** Clear description of the flaw
- **Why It Matters:** Architectural, security, or performance impact
- **Recommended Fix:** Concrete code change or remediation step
