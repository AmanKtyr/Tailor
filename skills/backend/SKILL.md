---
name: backend
description: Governs backend architecture, API contract design, database schema management, transactions, caching, and server-side performance.
---

# Backend Engineering Skill

Activate this skill when creating or updating API endpoints, database models, background jobs, caching layers, or backend services.

## 1. API Contract & Standards
- Check `.ai/API.md` for project API conventions (REST, GraphQL, tRPC).
- Use standard HTTP status codes:
  - `200 OK`, `201 Created`, `204 No Content`
  - `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`
  - `500 Internal Server Error`
- Always validate incoming request payloads before executing business logic.

## 2. Database & Data Integrity
- Check `.ai/DATABASE.md` for ORM and schema migration procedures.
- Always use transactional boundaries for multi-table mutating operations.
- Avoid N+1 query patterns by utilizing ORM joins, eager loading, or DataLoader.
- Keep business logic in domain services rather than dumping complex queries inside HTTP controllers.
