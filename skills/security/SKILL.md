---
name: security
description: Enforces security engineering principles, OWASP Top 10 defenses, zero hardcoded secrets, parameterized queries, and runs security audits.
---

# Security Engineering Skill

Activate this skill when dealing with authentication, authorization, secret management, database queries, cryptography, external network calls, or security audits (`/security-audit`).

---

## 1. Quick Automated Secret & Pattern Scanner

Before committing code, execute the bundled secret scanner script:

```bash
# Run deterministic secret and vulnerability checks
node skills/security/scripts/scan-secrets.js
```

---

## 2. Invariant Rules & Vulnerability Defenses

### A. Zero Hardcoded Secrets (CRITICAL)
* **Violation:**
  ```ts
  const STRIPE_SECRET = "sk_live_51Mz..."; // INSECURE
  ```
* **Remediation:**
  ```ts
  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) throw new Error("Missing STRIPE_SECRET_KEY in environment");
  ```

### B. Injection Defenses (CRITICAL)
* **Violation (Raw String Concatenation):**
  ```ts
  db.query(`SELECT * FROM users WHERE email = '${userEmail}'`); // INSECURE
  ```
* **Remediation (Parameterized Query / ORM):**
  ```ts
  db.query('SELECT * FROM users WHERE email = $1', [userEmail]); // SECURE
  ```

### C. Safe Deserialization & Code Execution (CRITICAL)
* **Violation:** `eval(data)`, `child_process.exec(userInput)`
* **Remediation:** `JSON.parse(data)`, `child_process.execFile(cmd, [args], { shell: false })`

### D. Strict Server-Side Authorization (HIGH)
* Never rely on client-side hiding alone (`{isAdmin && <AdminPanel />}`).
* Enforce authentication and role checks inside backend route handlers / server actions before data mutations.

---

## 3. Security Audit Output Format

When generating security audit reports (`/security-audit`):

```markdown
### [CRITICAL] SEC-001: Hardcoded AWS Access Key
- **Location:** `src/config/aws.ts:14`
- **Evidence:** `const AWS_KEY = "AKIA..."`
- **Impact:** Direct infrastructure compromise if committed.
- **Remediation:** Move key to AWS Secrets Manager or environment variables.
```
