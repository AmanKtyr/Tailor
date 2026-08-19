---
name: testing
description: Governs automated testing discipline, test runner discovery, targeted test execution, and enforces truthful verification.
---

# Testing Discipline Skill

Activate this skill when creating features, fixing bugs, refactoring code, or running verification test suites.

> **Testing Law:** *Untested code is broken code. Verified code has exit code 0.*

---

## 1. Targeted Test Execution Matrix

Run targeted tests for modified files to provide fast feedback, then run the full suite before concluding:

| Stack / Tool | Targeted Single-File Test Command | Full Project Test Suite Command |
| :--- | :--- | :--- |
| **Node.js (Vitest)** | `npm test -- path/to/file.test.ts` | `npm test` |
| **Node.js (Jest)** | `npx jest path/to/file.test.ts` | `npm test` |
| **Python (Pytest)** | `pytest tests/test_file.py -k "test_name"` | `pytest` |
| **Django** | `python manage.py test app.tests.TestClass` | `python manage.py test` |
| **Go** | `go test -v ./pkg/service -run TestFunctionName` | `go test ./...` |
| **Rust** | `cargo test test_name` | `cargo test` |
| **.NET C#** | `dotnet test --filter "FullyQualifiedName~TestMethod"` | `dotnet test` |
| **PHP (PHPUnit)** | `vendor/bin/phpunit tests/UserTest.php` | `vendor/bin/phpunit` |

---

## 2. The Testing Pyramid & Mocking Boundaries

```
      /\
     /  \     E2E Tests (Crucial user journeys only)
    /────\
   /      \   Integration Tests (API routes + DB queries + contracts)
  /────────\
 /          \ Unit Tests (Pure domain logic, utilities, edge cases)
/────────────\
```

### Mocking Rules
* **Mock External Boundaries Only:** Mock third-party payment gateways, email delivery, and cloud storage.
* **Do NOT Mock Pure Logic:** Never mock internal business functions or data transformers; test them with real inputs and assert exact outputs.
* **Use Deterministic Factories:** Use factories with fixed seeds; avoid random numbers (`Math.random()`) or unpinned system clocks in test assertions.

---

## 3. Non-Negotiable Testing Invariants

1. **Zero Fabrication:** Never state *"All tests passed"* without executing the test command and confirming that the process exited with code 0.
2. **Regression Assertion for Bugfixes:** Every bug fix must include an automated regression test reproducing the original bug condition and asserting its resolution.
3. **Clean Teardown:** Ensure tests clean up temporary files, mock servers, and database records to prevent cross-test pollution.
