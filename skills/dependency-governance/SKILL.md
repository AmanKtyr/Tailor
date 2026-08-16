---
name: dependency-governance
description: Evaluates new and existing dependencies for supply-chain risk, security advisories, license compliance, maintenance status, and unnecessary bloat.
---

# Dependency Governance Skill

Activate this skill before installing, upgrading, or recommending any external package or dependency.

## 1. Pre-Installation Gate
Before running `npm install`, `pip install`, `cargo add`, or equivalent:
1. **Redundancy Check:** Does an installed dependency already provide this capability? (e.g. `lodash` vs `ramda`, `nanoid` vs `uuid`).
2. **Framework Native Check:** Does the runtime or standard library provide it? (e.g. `crypto.randomUUID()` vs `uuid`, native `fetch` vs `axios`, `Intl` vs `moment`).
3. **Trivial Micro-Package Check:** Reject packages for trivial logic like `is-odd`, `is-number`, `left-pad`. Use native language primitives.

## 2. Supply-Chain & Security Assessment
Evaluate:
- Maintenance activity: Has the package been updated recently? Is the repository active?
- Security status: Check `npm audit`, `pip-audit`, or OSV database.
- License compatibility: Ensure permissive open-source licenses (MIT, Apache-2.0, BSD, ISC) unless commercial/copyleft is explicitly approved.
- Bundle & transitive weight: Avoid packages that bring hundreds of unvetted transitive dependencies.

## 3. Dependency Documentation
Record new approved dependencies in `.ai/DEPENDENCIES.md` with version, purpose, and security status.
