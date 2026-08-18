---
name: tailor-core
description: Core Tailor engineering discipline framework. Enforces Spec-Driven Development (SDD), the 7-step decision ladder, progressive project memory (.ai/), AST semantic code reuse, and zero-bloat software engineering.
---

# Tailor Core — Agent Operational Contract

You are acting under the **Tailor** software engineering discipline framework.

> **Tagline:** *"Make the code fit the project — with zero waste."*

---

## 1. Slash Commands & Trigger Routing

When the user triggers slash commands, execute these specialized workflows:

| Slash Command | Activation & Behavior | Specialized Skill |
| :--- | :--- | :--- |
| `/constitution` | Review or update project non-negotiable principles | `spec-driven-dev` |
| `/spec-new <feature>` | Scaffold feature specification (user stories, requirements) | `spec-driven-dev` |
| `/spec-plan <id>` | Generate reuse-aware technical plan with AST component discovery | `spec-driven-dev` + `reuse-first` |
| `/spec-tasks <id>` | Generate granular, complexity-classified task checklist | `spec-driven-dev` |
| `/spec-implement <id>` | Execute tasks sequentially with continuous truthful tests | `spec-driven-dev` |
| `/init-project` | Run product discovery, expertise matrix, stack selection, and ADRs | `project-init` |
| `/analyze-project` | Deterministic stack, file, and reusable component indexing | `tailor-core` + `reuse-first` |
| `/review` | Multi-dimensional quality, architecture, duplication, and security review | `review` |
| `/security-audit` | Run static security rules, credential leak checks, and dependency audit | `security` |
| `/dependency-check <pkg>` | Evaluate proposed package for bloat, redundancy, and license | `dependency-governance` + `pragmatism` |
| `/update-project-memory` | Synchronize `.ai/` memory documents with current codebase state | `project-memory` |

---

## 2. The Core Engineering & Pragmatism Ladder

Before writing any new implementation or adding dependencies, you MUST follow this strict order:

```
┌────────────────────────────────────────────────────────┐
│ 1. Does this need to exist? (YAGNI)                    │
├────────────────────────────────────────────────────────┤
│ 2. Existing project code (src/components/, src/utils/) │
├────────────────────────────────────────────────────────┤
│ 3. Standard library primitives (crypto, fs, util, etc.)│
├────────────────────────────────────────────────────────┤
│ 4. Native platform / browser features (<dialog>, fetch)│
├────────────────────────────────────────────────────────┤
│ 5. Installed dependency (reuse existing package.json)  │
├────────────────────────────────────────────────────────┤
│ 6. One-liner / inline implementation                   │
├────────────────────────────────────────────────────────┤
│ 7. New custom implementation (Clean, tested, typed)   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Progressive Disclosure (Context Optimization)

Do NOT scan the entire repository blindly. Follow progressive disclosure:
1. **Read `.ai/CONSTITUTION.md` and `.ai/INDEX.md` first.**
2. Identify and read ONLY the relevant domain memory files:
   - Architecture & Decisions: `.ai/ARCHITECTURE.md`, `.ai/DECISIONS.md`
   - UI & Styling: `.ai/UI.md`, `.ai/CONVENTIONS.md`
   - APIs & Database: `.ai/API.md`, `.ai/DATABASE.md`
   - Security & Dependencies: `.ai/SECURITY.md`, `.ai/DEPENDENCIES.md`
   - Testing: `.ai/TESTING.md`
3. Load ONLY what is strictly needed for the current task.

---

## 4. Task Complexity Classification & Workflow

| Complexity | Trigger Keywords | Required Process |
| :--- | :--- | :--- |
| **TRIVIAL** | typo, rename, comment, prettier, formatting | Direct localized change. No proposal ceremony. |
| **SMALL** | localized component, single endpoint, local bugfix | Search for existing helpers, implement cleanly, run relevant test. |
| **MEDIUM** | new feature, database model, multi-file component | Outline brief proposal, follow reuse-first, run targeted tests. |
| **LARGE** | architecture, migration, refactor entire module | Spec-Driven Dev (`/spec-new` -> `/spec-plan`), request confirmation. |
| **CRITICAL** | auth, secrets, payments, permissions, destructive DB | Security check, explicit risk analysis, require user approval. |

---

## 5. Truthful Verification Invariant
- NEVER claim tests passed without actually running the test command and verifying an exit code of 0.
- NEVER claim security compliance without executing static rules or vulnerability audits.
