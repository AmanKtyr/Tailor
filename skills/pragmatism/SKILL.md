---
name: pragmatism
description: Enforces radical pragmatic simplicity and zero-bloat software engineering. Enforces the 7-step decision ladder, intensity levels (lite, balanced, ultra, strict), and zero-dependency native APIs.
---

# Pragmatism & Anti-Bloat Skill

Activate this skill to eliminate over-engineered code, reject unnecessary packages, and write the minimal clean implementation that solves the requirement.

> **Motto:** *"Lazy, but never negligent. Simple, but never insecure."*

---

## 1. The 7-Step Decision Ladder (Mandatory Priority)

Before writing any new implementation or adding packages, work down this ladder and STOP at the first rung that provides a solution:

```
┌────────────────────────────────────────────────────────┐
│ 1. Does this need to exist? (YAGNI)                    │
│    -> If speculative or premature, REJECT IT.          │
├────────────────────────────────────────────────────────┤
│ 2. Already in this codebase?                           │
│    -> Search src/components/, src/lib/, src/utils/.    │
├────────────────────────────────────────────────────────┤
│ 3. Does the Standard Library do it?                    │
│    -> Use built-in crypto, fs, util, math, json, etc.  │
├────────────────────────────────────────────────────────┤
│ 4. Does a Native Platform / Browser API cover it?      │
│    -> Use <dialog>, <input type="date">, fetch, etc.   │
├────────────────────────────────────────────────────────┤
│ 5. Does an already-installed dependency solve it?      │
│    -> Reuse existing packages in package.json.         │
├────────────────────────────────────────────────────────┤
│ 6. Can it be written as a one-liner / inline helper?   │
│    -> If so, keep it concise (no 50-line wrappers).    │
├────────────────────────────────────────────────────────┤
│ 7. Only then: Write the minimum amount of clean code.  │
│    -> Enforce domain boundaries, types, and tests.     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Intensity Modes

| Mode | Behavior & Strictness |
| :--- | :--- |
| **`lite`** | Gentle guidance; writes requested code but politely proposes the simpler standard-library alternative. |
| **`balanced`** *(default)* | Strictly enforces the decision ladder; rejects micro-packages (`is-odd`, `left-pad`) and duplicates. |
| **`ultra`** | Hyper-minimalist; actively prefers deleting dead code, rejects any external package when a 3-line helper works. |
| **`strict`** | CI enforcement mode; treats any redundant package or bypassed reuse check as a hard failure. |

---

## 3. The "Lazy, Not Negligent" Guardrails
Laziness NEVER excuses skipping safety:
* **Security & Validation:** Never skip input sanitization, CSRF defenses, or SQL parameterization.
* **Accessibility:** Native elements (`<button>`, `<dialog>`) must retain proper ARIA labels and focus states.
* **Data Integrity:** Database transactions and atomic writes must be preserved.
* **Testing:** Always run tests and verify exit code 0.
