# Security Policy & Controls

**Status:** ACTIVE  
**Last Verified:** 2026-10-19  

## Baseline Controls & Threat Defenses
- **Zero Hardcoded Secrets:** Never commit secrets, API keys, or private certificates to source control. Use environment variables.
- **SQL & NoSQL Injection:** Parameterize all database queries. Validate all request schemas with Zod; reject object payloads in NoSQL filter operators.
- **Access Control & IDOR:** Enforce server-side authentication and scope every database query to the authenticated `user_id`/tenant. Never trust client-side ID parameters.
- **Safe Execution & Process Isolation:** Avoid arbitrary shell execution (`exec`), `eval()`, or unsafe deserialization. Use `execFile` with fixed binaries and argument arrays.
- **Cross-Site Scripting (XSS):** Never use `dangerouslySetInnerHTML` or raw HTML interpolation. Validate and sanitize all external URLs to block `javascript:` pseudo-protocols.
- **SSRF Defense:** Validate and filter all outbound server requests. Block local and private IPv4/IPv6 ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254`).
- **Cryptographic Rigor:** Use `argon2id`/`bcrypt` for password hashing, `crypto.randomBytes()` for tokens, and `crypto.timingSafeEqual()` for secret comparisons to prevent timing attacks.
- **Path Traversal:** Validate and constrain file system operations using `path.resolve()` with strict base directory prefix checks (`startsWith`).
