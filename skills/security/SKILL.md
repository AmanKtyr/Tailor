---
name: security
description: Enforces security engineering principles, OWASP Top 10 defenses, secret protection, safe cryptographic usage, and runs security audits.
---

# Security Engineering Skill

Activate this skill when handling authentication, authorization, input validation, secret management, database queries, cryptography, or security audits (`/security-audit` or `tailor security`).

## 1. Core Security Invariants
- **Input Validation & Sanitization:** Validate all data at system boundaries (Zod, Pydantic, JSON Schema).
- **Zero Hardcoded Secrets:** Never commit API keys, private keys, database passwords, or JWT secrets to source code. Use environment variables.
- **Injection Defenses:** Always use parameterized queries or type-safe ORMs. NEVER concatenate raw user input into SQL queries, OS shell commands, or LDAP lookups.
- **Authentication & RBAC:** Enforce server-side authorization checks on all mutating API endpoints and data queries.
- **XSS & Output Encoding:** Avoid raw HTML interpolation (`dangerouslySetInnerHTML`, `innerHTML`) without DOMPurify sanitization.
- **Transport Security:** Enforce strict TLS certificate verification in production.

## 2. Security Audit Workflow
- Inspect project configurations and dependency manifests.
- Scan for hardcoded keys, disabled TLS flags, and dangerous APIs (`eval()`, unsafe shell executions).
- Categorize findings into CRITICAL, HIGH, MEDIUM, LOW, and INFO with actionable remediation.
