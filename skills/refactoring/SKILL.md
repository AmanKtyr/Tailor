---
name: refactoring
description: Governs code refactoring, duplicate elimination, dead code pruning, and architectural restructuring without introducing regressions.
---

# Refactoring Skill

Activate this skill when restructuring existing code, eliminating duplicates, modernizing patterns, or pruning dead code.

## 1. Safety & Baseline Invariants
1. **Verify Existing Tests:** Ensure test suites run and pass before initiating refactoring.
2. **Preserve Public API Contracts:** Do not break external callers or exported signatures without updating all references.
3. **Small Atomic Commits / Edits:** Refactor in manageable increments rather than rewriting entire files blindly.

## 2. Eliminating Duplications
- Extract duplicated helper functions into shared utility modules (`src/utils/`, `src/lib/`).
- Consolidate near-identical UI components into a parameterized base component with clean variant props.
- Re-run test suites after consolidation to verify zero behavior regression.
