# Dependency Governance

**Last Verified:** 2026-08-16  
**Audit Policy:** Require automated vulnerability & license checks before adding new packages.

## Recorded Dependencies
- **`commander`** (`^12.1.0`): Production dependency
- **`js-yaml`** (`^4.1.0`): Production dependency
- **`picocolors`** (`^1.1.1`): Production dependency

## Policy for New Dependencies
1. Check if existing installed packages or framework built-ins already solve the problem.
2. Evaluate maintenance activity, security history, and license compatibility (e.g. MIT, Apache-2.0, BSD).
3. Do not add packages for trivial operations easily handled by 5-10 lines of standard code.
