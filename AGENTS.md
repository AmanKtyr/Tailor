# Agent Instructions for @amanktyr/tailor

This repository uses **Tailor** for project intelligence and memory.

## Non-Negotiable Directives
1. **Constitution & Project Memory First:** Always consult [`.ai/CONSTITUTION.md`](.ai/CONSTITUTION.md) and [`.ai/INDEX.md`](.ai/INDEX.md) before making non-trivial changes.
2. **Zero Unsolicited Styling:** NEVER add, alter, or inject CSS, Tailwind classes, colors, gradients, or restyle components unless explicitly requested.
3. **Zero Bloat & Speculative Code:** Minimal diff discipline; no mock datasets, premature abstractions, or obvious filler comments.
4. **Reuse-First Decision Ladder:** Search existing components, hooks, and utilities before writing new code.
5. **Pragmatic Simplicity:** Prefer standard library and native platform APIs over trivial external dependencies.
6. **Spec-Driven Discipline:** For non-trivial features, follow the specification lifecycle (`specs/<id>/spec.md` -> `plan.md` -> `tasks.md`).
7. **Truthful Verification:** Verify changes with targeted tests; never fabricate test passes.
