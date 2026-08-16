# AI Project Index

**Project:** tailor-ai  
**Type:** cli  
**Primary Language:** TypeScript  
**Last Verified:** 2026-08-16  

## Read First
1. [`PROJECT.md`](PROJECT.md) — High-level product overview and objectives.
2. [`STACK.md`](STACK.md) — Verified technology stack and dependencies.
3. [`CONVENTIONS.md`](CONVENTIONS.md) — Coding conventions, formatting, and patterns.
4. [`AGENT-CONTRACT.md`](AGENT-CONTRACT.md) — Operational contract for coding agents.

## Relevant Domain Memory Files
- Architecture & Decisions: [`ARCHITECTURE.md`](ARCHITECTURE.md), [`DECISIONS.md`](DECISIONS.md)
- Code Organization: [`STRUCTURE.md`](STRUCTURE.md)
- UI & Styling: [`UI.md`](UI.md)
- Backend & Endpoints: [`API.md`](API.md), [`DATABASE.md`](DATABASE.md)
- Security & Compliance: [`SECURITY.md`](SECURITY.md), [`DEPENDENCIES.md`](DEPENDENCIES.md)
- Quality & Testing: [`TESTING.md`](TESTING.md)

## Critical Rules
1. **Reuse First:** Always search existing components, utils, and abstractions before writing new code.
2. **Follow Stack:** Never introduce new frameworks or duplicate styling libraries without explicit justification.
3. **Preserve Architecture:** Respect ADRs in `DECISIONS.md`. Do not rewrite architecture unprompted.
4. **Targeted Validation:** Run relevant tests for changed areas. Do not fabricate test or security passes.
