---
name: reuse-first
description: Enforces reuse-first engineering before creating new components, utilities, hooks, CSS classes, or abstractions. Prevents duplicate code.
---

# Reuse-First Engineering Skill

Activate this skill whenever you are about to create a new component, function, hook, utility, service, or CSS style.

## 1. The Reuse-First Engineering Ladder
Never jump straight to writing a new implementation. Step through this ladder:
1. **Existing project implementation:** Inspect `src/components/`, `src/lib/`, `src/utils/`, etc.
2. **Existing shared abstraction:** Can an existing component/function be parameterized or extended?
3. **Framework built-ins:** Does the framework already provide this (e.g. Next.js Image, React Hook Form, Python `dataclasses`)?
4. **Installed libraries:** Does an installed package in `package.json` / `pyproject.toml` provide this?
5. **New trusted library:** Only if the requirement is non-trivial and a maintained package exists.
6. **New custom implementation:** Only when steps 1–5 do not satisfy the project needs.

## 2. Active Semantic Search
Do not rely solely on exact name matches:
- Looking for a Modal? Search for `Dialog`, `Popup`, `Drawer`, `Sheet`.
- Looking for a user query function? Search for `getUser`, `fetchUser`, `loadUser`, `findUser`, `queryUser`.
- Looking for date formatting? Search for `formatDate`, `formatTimestamp`, `dateUtils`.

## 3. When NOT to Reuse
Reuse is not absolute. Do NOT reuse code if:
- It is deprecated or marked for removal.
- It introduces inappropriate coupling across unrelated architectural layers.
- It is insecure or contains known vulnerabilities.
- It forces excessive hacks or brittle conditionals.
When rejecting reuse, explicitly document the rationale in code comments or the implementation proposal.
