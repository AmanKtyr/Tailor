# AI Agent Guidance (Powered by Tailor)

This repository uses **Tailor** for project intelligence, Spec-Driven Development, and Reuse-First engineering discipline.

## Non-Negotiable Directives

### 1. Cold-Start & Project Memory Hierarchy
- Always consult [`.ai/CONSTITUTION.md`](.ai/CONSTITUTION.md) and [`.ai/INDEX.md`](.ai/INDEX.md) first before planning or making non-trivial modifications.
- **Cold-Start Fallback:** If the `.ai/` directory does not exist yet, do NOT invent arbitrary conventions. Inspect `package.json` (or workspace manifests) and active source files directly to determine established patterns, and suggest running `npx @amanktyr/tailor init` to establish project memory.

### 2. Mandatory Guardrail: Zero Unrequested Styling & Redesign
- **STRICTLY PROHIBITED:** NEVER add, alter, or inject CSS, styling frameworks, inline styles, gradients, glassmorphism, or animations unless the user explicitly requested visual or styling changes.
- When working on logic, bugfixes, refactoring, or state management: preserve existing visual markup and styling tokens untouched.
- When writing UI components: strictly reuse existing design tokens, components, and CSS classes from the codebase or `.ai/UI.md`. Never invent new arbitrary classes, hex colors, or custom styling rules.
- If the project has no styling system and no styling is requested, output clean, unstyled semantic HTML.

### 3. Mandatory Guardrail: Zero Bloat & Minimal Diff Discipline (Anti-Slop)
- Implement **only** the minimal code required to satisfy the user's specific request.
- **NO speculative abstractions:** Do not create premature wrapper classes, generic factories, or speculative interfaces for one-off operations.
- **NO dummy/mock data:** Never add mock datasets, fake user lists, or placeholder fixtures in production code.
- **NO filler comments:** Never write redundant explanatory comments (e.g. `// Here we define the function`) that state the obvious. Only document *why* non-obvious business logic or security decisions exist.

### 4. Reuse-First Decision Ladder
Before writing any new function, hook, utility, or component, execute this sequence:
1. **YAGNI:** Does this truly need to exist? If speculative, reject it.
2. **Reuse:** Search the codebase (`src/components/`, `src/utils/`, `src/hooks/`) for matching or similar implementations (>=70% semantic similarity: extend or parameterize instead of duplicating).
3. **Standard Library:** Use native standard library / browser APIs (e.g. `crypto.randomUUID()`, `structuredClone()`, `fetch()`) instead of external micro-packages.
4. **Existing Dependencies:** Prefer already-installed dependencies over introducing new packages.
5. **Minimal Custom Code:** Only write new code when no existing primitive or component solves the requirement.

### 5. Spec-Driven Discipline
- For non-trivial features or multi-step tasks, follow the specification lifecycle (`specs/<id>/spec.md` -> `plan.md` -> `tasks.md`).

### 6. Truthful Verification
- Run targeted tests and verify changes before completion. Never fabricate test passes or security claims without running the verification command and confirming exit code 0.
