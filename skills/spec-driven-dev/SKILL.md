---
name: spec-driven-dev
description: Enforces Spec-Driven Development (SDD). Converts user intent into structured specifications, technical plans with pre-execution reuse audits, and verified granular task checklists.
---

# Spec-Driven Development (SDD) Skill

Activate this skill when creating non-trivial features, refactoring major subsystems, or building new modules from specifications.

> **Philosophy:** *Specification is the contract. Reuse is the law. Code is the byproduct.*

---

## 1. Slash Commands & Workflow

| Slash Command | Purpose & Description | Output Artifact |
| :--- | :--- | :--- |
| `/constitution` | Review or update project non-negotiable principles | `.ai/CONSTITUTION.md` |
| `/spec-new <feature>` | Scaffold feature user stories, requirements, and edge cases | `specs/<id>-<name>/spec.md` |
| `/spec-plan <id>` | Generate reuse-aware technical plan (queries AST catalog) | `specs/<id>-<name>/plan.md` |
| `/spec-tasks <id>` | Generate ordered, complexity-classified task checklist | `specs/<id>-<name>/tasks.md` |
| `/spec-implement <id>` | Execute tasks sequentially with continuous truthful tests | Verified Source Code |

---

## 2. The Spec-Driven Lifecycle

```
┌────────────────────────────────────────────────────────┐
│ 1. CONSTITUTION: .ai/CONSTITUTION.md                   │
│    Project non-negotiables, intensity, guardrails       │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 2. SPECIFICATION: specs/<id>-<name>/spec.md            │
│    User stories, functional requirements, edge cases   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 3. TECHNICAL PLAN: specs/<id>-<name>/plan.md           │
│    AST REUSE AUDIT + file layout + 0-dep verification  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 4. TASK CHECKLIST: specs/<id>-<name>/tasks.md          │
│    Granular task ordering (TRIVIAL -> CRITICAL)        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 5. IMPLEMENTATION & VERIFICATION                       │
│    Atomic changes + unit tests (Exit code: 0)          │
└────────────────────────────────────────────────────────┘
```

---

## 3. Spec Pre-Execution Reuse Rule
Before proposing any new file in `plan.md`, the agent MUST:
1. Search workspace AST catalog (`tailor analyze` or `skills/reuse-first/scripts/find-duplicates.js`).
2. Populate the **Reuse-First Audit** table in `plan.md`.
3. If an existing component or utility matches >= 70%, reuse or extend it instead of writing a duplicate.
