---
name: dependency-governance
description: Evaluates new and installed packages for supply-chain security, maintenance status, license compatibility, and rejects trivial bloat.
---

# Dependency Governance Skill

Activate this skill before installing, proposing, or upgrading any external dependency (`/dependency-check <package>`).

---

## 1. Automated Rejection Table for Trivial Micro-Packages

Always reject external micro-packages for operations easily handled by standard language primitives:

| Proposed Package | Recommendation | Preferred Native Alternative |
| :--- | :--- | :--- |
| `is-odd` / `is-even` | **REJECT** | `(n % 2 !== 0)` / `(n % 2 === 0)` |
| `left-pad` | **REJECT** | `String.prototype.padStart()` |
| `is-number` | **REJECT** | `typeof x === 'number'` |
| `clone-deep` | **REJECT** | `structuredClone(obj)` |
| `deepmerge` | **REJECT** | Native object spread `{...a, ...b}` or small utility |

---

## 2. Redundancy & Modern Alternative Checks

| Proposed Package | Check Existing In Workspace | Modern Framework Alternative |
| :--- | :--- | :--- |
| `axios` | Check if `got`, `node-fetch`, or native `fetch` exists | Native global `fetch()` |
| `moment` | Check if `date-fns`, `dayjs`, or `luxon` exists | `date-fns` or `Intl.DateTimeFormat` |
| `uuid` | Check if `nanoid` or `cuid` exists | `crypto.randomUUID()` |
| `crypto-js` | Check if native `crypto` exists | `node:crypto` or Web Crypto API |

---

## 3. Supply-Chain Security Checklist

Before approving any non-trivial package:
1. **Security Vulnerabilities:** Run `npm audit` or `pip-audit`.
2. **Maintenance Activity:** Confirm recent releases within the past 12 months.
3. **Permitted Open Source Licenses:**
   - Allowed: `MIT`, `Apache-2.0`, `BSD-2-Clause`, `BSD-3-Clause`, `ISC`, `0BSD`, `CC0-1.0`.
   - Flag for review: `GPL-3.0`, `AGPL-3.0`, `SSPL` (copyleft / network copyleft implications).
4. **Document Decision:** Record new packages in `.ai/DEPENDENCIES.md`.
