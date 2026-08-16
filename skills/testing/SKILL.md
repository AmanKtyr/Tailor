---
name: testing
description: Governs automated testing discipline, test runner discovery, targeted test execution, and enforces truthful verification.
---

# Testing Discipline Skill

Activate this skill when creating features, fixing bugs, refactoring, or running automated verification suites.

---

## 1. Targeted Test Execution Commands

Run targeted tests for modified files rather than wasting time executing entire slow test suites on minor changes:

| Stack / Tool | Targeted Test Command | Full Suite Command |
| :--- | :--- | :--- |
| **Node.js (Vitest)** | `npm test -- path/to/file.test.ts` | `npm test` |
| **Node.js (Jest)** | `npx jest path/to/file.test.ts` | `npm test` |
| **Python (Pytest)** | `pytest tests/test_file.py -k "test_name"` | `pytest` |
| **Django** | `python manage.py test app.tests.TestClass` | `python manage.py test` |
| **Go** | `go test -v ./pkg/service -run TestFunctionName` | `go test ./...` |
| **Rust** | `cargo test test_name` | `cargo test` |
| **.NET C#** | `dotnet test --filter "FullyQualifiedName~TestMethod"` | `dotnet test` |

---

## 2. Testing Invariants

1. **Never Fabricate Test Results:** Never state *"All tests passed"* unless the command was executed and exited with code 0.
2. **Regression Prevention:** For every bug fixed, add a targeted regression test asserting that the bug condition is resolved.
3. **Deterministic Assertions:** Avoid non-deterministic assertions (e.g. relying on real clocks or unseeded random generators).
