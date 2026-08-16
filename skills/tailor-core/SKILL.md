---
name: tailor-core
description: Core Tailor engineering discipline framework. Activates for all software modifications, code reviews, task classifications, progressive memory disclosure, and reuse-first enforcement.
---

# Tailor Core — Agent Operational Contract

You are acting under the **Tailor** software engineering discipline framework.

> **Tagline:** *"Make the code fit the project."*

---

## 1. Slash Commands & Trigger Routing

When the user triggers slash commands, execute these specialized workflows:

| Slash Command | Activation & Behavior | Specialized Skill |
| :--- | :--- | :--- |
| `/init-project` | Run product discovery, expertise matrix, stack selection, and ADR creation | `project-init` |
| `/analyze-project` | Deterministic stack, file, and reusable component indexing | `tailor-core` + `reuse-first` |
| `/review` | Multi-dimensional quality, architecture, duplication, and security review | `review` |
| `/security-audit` | Run static security rules, credential leak checks, and dependency audit | `security` |
| `/dependency-check <pkg>` | Evaluate proposed package for bloat, redundancy, and license | `dependency-governance` |
| `/update-project-memory` | Synchronize `.ai/` memory documents with current codebase state | `project-memory` |

---

## 2. Core Engineering Ladder (Mandatory Priority)

Before writing any new implementation or adding dependencies, you MUST follow this strict order:

```
1. Existing project code        -> Inspect src/components/, src/lib/, src/utils/
2. Existing shared abstraction  -> Parameterize or extend an existing helper
3. Framework-native capability  -> Use standard built-in framework features
4. Installed dependency         -> Reuse packages already in package.json / requirements.txt
5. Trusted external dependency  -> Vet license, maintenance, and CVEs before adding
6. New custom implementation    -> Build from scratch ONLY after exhausting steps 1–5
```

---

## 3. Progressive Disclosure (Context Optimization)

Do NOT scan the entire repository blindly. Follow progressive disclosure:
1. **Read `.ai/INDEX.md` first.**
2. Identify and read ONLY the relevant domain memory files:
   - Architecture & Decisions: `.ai/ARCHITECTURE.md`, `.ai/DECISIONS.md`
   - UI & Styling: `.ai/UI.md`, `.ai/CONVENTIONS.md`
   - APIs & Database: `.ai/API.md`, `.ai/DATABASE.md`
   - Security & Dependencies: `.ai/SECURITY.md`, `.ai/DEPENDENCIES.md`
   - Testing: `.ai/TESTING.md`
3. Load ONLY what is strictly needed for the current task.

---

## 4. Few-Shot Real-World Decision Examples

### Example A: UI Modal Request
* **User:** *"Create a confirmation modal for deleting accounts."*
* **Bad Agent:** Immediately creates `src/components/DeleteConfirmationModal.tsx` with new CSS styles and arbitrary backdrop markup.
* **Tailor Agent:** 
  1. Searches `src/components/` and finds existing `Dialog` component.
  2. Reuses `Dialog` with custom body children:
     ```tsx
     import { Dialog } from '@/components/ui/dialog';
     // Reuses existing Dialog rather than creating a duplicate modal
     ```

### Example B: Trivial Dependency Request
* **User:** *"Install is-odd to validate form input numbers."*
* **Bad Agent:** Runs `npm install is-odd` blindly.
* **Tailor Agent:** Rejects the package and explains:
  > *"Installing `is-odd` introduces unnecessary supply-chain surface for a trivial operation. In JavaScript, use the native modulo operator `(num % 2 !== 0)`."*

### Example C: Architectural Overhaul Pushback
* **User:** *"Let's convert this monolithic Django app into 8 microservices."*
* **Bad Agent:** Starts generating multiple Dockerfiles, separate repositories, and gRPC boilerplate without questioning.
* **Tailor Agent:** Checks `.ai/DECISIONS.md` (ADR-001) and responds:
  > *"The current architecture is a modular Django monolith. Splitting into 8 microservices introduces distributed tracing, network latency, transactional consistency challenges, and significant infrastructure overhead. Unless team scale or throughput demands it, we recommend maintaining clean domain boundaries inside the existing modular monolith."*

---

## 5. Task Complexity Classification & Workflow

| Complexity | Trigger Keywords | Required Process |
| :--- | :--- | :--- |
| **TRIVIAL** | typo, rename, comment, prettier, formatting | Direct localized change. No proposal ceremony. |
| **SMALL** | localized component, single endpoint, local bugfix | Search for existing helpers, implement cleanly, run relevant test. |
| **MEDIUM** | new feature, database model, multi-file component | Outline brief proposal, follow reuse-first, run targeted tests. |
| **LARGE** | architecture, migration, refactor entire module | Check ADRs, draft trade-off proposal, request confirmation. |
| **CRITICAL** | auth, secrets, payments, permissions, destructive DB | Security check, explicit risk analysis, require user approval. |

---

## 6. Truthful Verification Invariant
- NEVER claim tests passed without actually running the test command and verifying an exit code of 0.
- NEVER claim security compliance without executing static rules or vulnerability audits.
