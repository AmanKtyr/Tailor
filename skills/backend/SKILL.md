---
name: backend
description: Governs backend architecture, API contract design, database schema management, transactional boundaries, query optimization, and error handling standards.
---

# Backend Engineering Skill

Activate this skill when creating or updating API endpoints, database models, background jobs, caching layers, or backend services.

> **Operational Directive:** *Design resilient, validated, and performant backend services with strict data integrity.*

---

## 1. API Contract Design & HTTP Standards

Check `.ai/API.md` for project-specific conventions (REST, GraphQL, tRPC). Adhere to standard HTTP semantics:

### Status Code Standards
* `200 OK`: Successful retrieval or synchronous update.
* `201 Created`: Resource successfully created (include `Location` header or created object).
* `204 No Content`: Successful mutation with no response body (e.g. deletion).
* `400 Bad Request`: Malformed syntax, invalid JSON, or failed input schema validation.
* `401 Unauthorized`: Missing or invalid authentication token.
* `403 Forbidden`: Authenticated user lacks permission to access this resource.
* `404 Not Found`: Resource does not exist.
* `409 Conflict`: Unique constraint violation or state transition conflict.
* `422 Unprocessable Entity`: Semantically invalid payload (business rule failure).
* `500 Internal Server Error`: Unhandled server error (never leak internal stack traces to client).

### Standard Error Response Envelope
```json
{
  "error": {
    "code": "INVALID_PAYLOAD",
    "message": "The provided email address is already in use.",
    "details": [
      { "field": "email", "issue": "Unique constraint violation" }
    ],
    "requestId": "req_01h7x..."
  }
}
```

---

## 2. Input Validation & Schema Guardrails

* Always parse and validate incoming request payloads at the boundary using schema validators (`Zod`, `Pydantic`, `Joi`, `Validator.js`) before calling business logic.
* Strip unvalidated fields to prevent Mass Assignment vulnerabilities.

---

## 3. Database Integrity, Queries & Transactions

* **Transactional Boundaries:** Always wrap multi-table write operations inside atomic database transactions (`tx.run()`, `db.transaction()`).
* **Prevent N+1 Query Anti-Patterns:** Use ORM joins (`include`, `select_related`, `prefetch_related`) or DataLoader rather than executing queries inside loops.
* **Pagination Standards:**
  - For small, static sets: Offset-based pagination (`limit`, `offset`).
  - For high-volume, real-time data: Keyset / Cursor-based pagination (`cursor`, `take`).
* **Connection Pooling:** Reuse connection pools; never instantiate new database connection clients per HTTP request.
