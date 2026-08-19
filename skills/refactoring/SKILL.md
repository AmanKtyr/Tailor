---
name: refactoring
description: Governs code refactoring, duplicate elimination, dead code pruning, and architectural restructuring without introducing regressions.
---

# Refactoring Skill

Activate this skill when restructuring existing code, eliminating duplicates, modernizing patterns, decomposing monolithic functions, or pruning dead code.

> **Refactoring Law:** *Refactoring improves the internal structure of software without altering its external observable behavior.*

---

## 1. Safety & Baseline Invariants

Before modifying any existing implementation:
1. **Verify Baseline Tests:** Run existing test suites (`npm test`, `pytest`, `cargo test`) and confirm that all tests pass before making any changes.
2. **Preserve Public API Contracts:** Never alter exported function signatures, route parameters, or database schemas without a documented deprecation plan and updating all internal call sites.
3. **Atomic, Incremental Changes:** Refactor in small, verifiable steps. Never attempt large-scale rewrites in a single unverified commit.

---

## 2. Standard Refactoring Patterns

### A. Extract Function / Helper
* **Problem:** Monolithic 200-line function with mixed levels of abstraction.
* **Solution:** Extract isolated operations into small, single-responsibility pure functions in `src/utils/` or `src/lib/`.

### B. Introduce Parameter Object
* **Problem:** Functions accepting 6+ positional arguments (`function createUser(name, email, age, role, status, plan)`).
* **Solution:** Replace with a typed configuration object (`interface CreateUserOptions`).

### C. Strangler Fig Pattern (For Legacy Subsystem Migration)
* **Problem:** Migrating a legacy service to a new architecture without risky downtime.
* **Solution:** Build the new implementation alongside the legacy service; route traffic incrementally through a facade until the old system is completely superseded, then prune the legacy code.

---

## 3. Duplicate Elimination & Dead Code Pruning

* Search for repeated logic blocks across components using the AST duplicate finder.
* Consolidate duplicate helpers into a shared utility, replace all call sites, and remove dead unused exports.
* Re-run all verification suites and confirm **0 regressions**.
