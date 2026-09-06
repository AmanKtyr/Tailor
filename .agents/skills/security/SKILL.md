---
name: security
description: Enforces security engineering principles, OWASP Top 10 defenses, zero hardcoded secrets, auth, JWT, passwords, CORS, encryption, XSS, parameterized queries, and vulnerability scanning.
---

# Security Engineering Skill

Activate this skill when dealing with authentication, authorization, secret management, database queries, cryptography, external network calls, or security audits (`/security-audit`).

> **Security Law:** *Security is never an afterthought. Validate all inputs, parameterize all queries, and never trust client-side claims.*

---

## 1. Automated Secret & Pattern Scanner

Before committing code or concluding a task, run the automated security scanner:

```bash
# Run deterministic secret and vulnerability checks
node skills/security/scripts/scan-secrets.js
```

---

## 2. Invariant Rules & Defense Implementations

### A. Zero Hardcoded Secrets (CRITICAL)
* **Insecure Anti-Pattern:**
  ```ts
  const AWS_KEY = "AKIAIOSFODNN7EXAMPLE";
  const STRIPE_SECRET = "sk_live_51Mz98...";
  ```
* **Secure Standard:**
  ```ts
  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) {
    throw new Error("CRITICAL: STRIPE_SECRET_KEY environment variable is not defined.");
  }
  ```

### B. SQL Injection Defense (CRITICAL)
* **Insecure (Raw String Concatenation):**
  ```ts
  db.query(`SELECT * FROM users WHERE email = '${userEmail}'`);
  ```
* **Secure (Parameterized Query / Prepared Statement):**
  ```ts
  db.query('SELECT * FROM users WHERE email = $1', [userEmail]);
  ```

### C. Safe Execution & Deserialization (CRITICAL)
* **Forbidden Functions:** `eval()`, `new Function()`, `setTimeout(string)`, `child_process.exec(userInput)`.
* **Safe Alternatives:** Use `JSON.parse()`, `child_process.execFile(binaryPath, [args], { shell: false })`.

### D. Server-Side Authorization Invariant (HIGH)
* Never rely on client-side conditional rendering (`{isAdmin && <DeleteButton />}`) as security.
* Enforce authentication, session validation, and role-based permissions inside server route handlers or server actions before executing any data mutation.

### E. Path Traversal Defense (HIGH)
* Always resolve and sanitize user-supplied file paths against an allowed root directory using `path.resolve()` and ensure `resolvedPath.startsWith(allowedRootDirectory)`.

---

## 3. Standard Security Finding Schema (`/security-audit`)

```markdown
### [CRITICAL] SEC-001: [Short Vulnerability Title]
- **Location:** `src/controllers/userController.ts:42`
- **Vulnerability Type:** SQL Injection / Hardcoded Credential / Insecure Deserialization
- **Evidence:** `db.query("SELECT * FROM users WHERE id = " + req.params.id)`
- **Impact:** Direct data exposure or unauthorized remote manipulation.
- **Remediation:** Replace with parameterized query placeholder `$1`.
```

---

## 4. Mandatory Pre-Commit Security Checklist

Before marking any task complete, verify these 5 checkpoints:
1. **[ ] Zero Hardcoded Secrets:** Verified that no tokens, passwords, private keys, or credentials exist in new or modified lines.
2. **[ ] SQL/NoSQL Parameterization:** Confirmed all database access uses parameter placeholders or ORM query builders.
3. **[ ] Server-Side Authorization:** Confirmed all mutation endpoints enforce identity and permission checks server-side.
4. **[ ] Path Traversal Shielding:** Checked that all file access paths are validated against allowed root directories.
5. **[ ] Scanner Execution:** Ran `tailor security` or `node skills/security/scripts/scan-secrets.js` with exit code 0.

