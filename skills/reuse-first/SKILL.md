---
name: reuse-first
description: Enforces reuse-first software engineering. Prevents duplicate components, utilities, hooks, functions, CSS classes, and abstractions by searching existing project code first.
---

# Reuse-First Engineering Skill

Activate this skill before creating any new component, utility function, hook, service, database helper, or CSS class.

---

## 1. Quick Automated Search
Before writing new code, execute the bundled duplicate finder script to inspect existing symbols:

```bash
# Search for matching components or functions in workspace
node skills/reuse-first/scripts/find-duplicates.js modal
node skills/reuse-first/scripts/find-duplicates.js user
```

---

## 2. The Reuse-First Engineering Ladder

```
┌────────────────────────────────────────────────────────┐
│ 1. Existing Project Code (src/components, src/utils)   │
├────────────────────────────────────────────────────────┤
│ 2. Existing Shared Abstraction (Extend/Parameterize)   │
├────────────────────────────────────────────────────────┤
│ 3. Framework-Native APIs (Next.js, React, Node.js)     │
├────────────────────────────────────────────────────────┤
│ 4. Existing Installed Dependencies (package.json)      │
├────────────────────────────────────────────────────────┤
│ 5. Trusted External Dependency (After security review) │
├────────────────────────────────────────────────────────┤
│ 6. New Custom Implementation (Only as last resort)     │
└────────────────────────────────────────────────────────┘
```

---

## 3. Semantic Synonym Lookup Table

Search for concept synonyms rather than exact names only:

| Requested Concept | Search Keywords to Inspect First |
| :--- | :--- |
| **Modal** | `Dialog`, `Popup`, `Sheet`, `Drawer`, `AlertModal` |
| **Toast / Alert** | `Notification`, `Snackbar`, `Banner`, `Toast`, `Message` |
| **Data Fetcher** | `getUser`, `fetchUser`, `loadUser`, `findUser`, `queryUser`, `UserService` |
| **Date Helper** | `formatDate`, `formatTimestamp`, `parseDate`, `dateUtils`, `Intl.DateTimeFormat` |
| **Button / CTA** | `Button`, `IconButton`, `ActionButton`, `SubmitBtn` |
| **Dropdown** | `Select`, `Combobox`, `MenuSelect`, `DropdownMenu` |
| **HTTP Client** | `apiClient`, `http`, `fetcher`, `request`, native `fetch` |

---

## 4. When NOT to Reuse (Engineering Judgment)

Do NOT reuse existing code if:
* **Security risk:** The existing code has known vulnerabilities or lacks proper authorization.
* **Obsolete code:** The existing component is marked `@deprecated` or scheduled for retirement.
* **Unwanted coupling:** Reusing it would force two unrelated domain modules into an unnatural dependency.
* **Brittle hacks:** Reusing it requires adding numerous boolean flags, fragile if-else branches, or CSS `!important` hacks.

*Rule:* **Reuse when appropriate; do not reuse blindly.**
