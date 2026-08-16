---
name: testing
description: Governs automated testing discipline, test runner discovery, targeted test execution, and prevents fake test claims.
---

# Testing Discipline Skill

Activate this skill when creating new features, fixing bugs, refactoring, or running automated verification suites.

## 1. Test Runner Discovery
- Check `.ai/STACK.md` and `.ai/TESTING.md` for the established test suite (Vitest, Jest, Pytest, Go Test, Cargo Test).
- Do NOT introduce an additional test runner without explicit justification.

## 2. Targeted Execution Strategy
- For localized fixes: Run targeted tests for the affected file/module (e.g. `npm test -- path/to/file.test.ts`).
- For high-risk or structural refactors: Run the full test suite.
- Do NOT scan or run slow E2E tests unnecessarily for trivial single-line changes.

## 3. Strict Truthfulness Invariant
- NEVER output that tests passed unless you actually invoked the test runner and it exited with code 0.
- If a test fails, diagnose the root cause, fix the implementation, and re-run.
