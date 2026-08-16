---
name: project-init
description: Activates when bootstrapping a new project or running /init-project. Conducts product discovery, developer expertise assessment, stack recommendation, and ADR generation.
---

# Project Initialization Skill

Activate this skill when the user asks to start, initialize, or bootstrap a new project from an idea (e.g. `tailor init` or `/init-project`).

## 1. Discovery Phase (Do NOT Start Coding Immediately)
Gather critical project scope and developer expertise before choosing technologies:

### Product Discovery Questions
1. **Target Product & Scope:** What is being built and who are the end users?
2. **Platform & Modality:** Public web app, SaaS, mobile, desktop, backend API, or CLI?
3. **Scale & Performance:** Expected traffic, concurrent users, and data volume?
4. **Hosting & Deployment:** Serverless, cloud container (AWS/GCP), VPS, or local?
5. **Timeline & Budget:** Prototype, MVP, or enterprise-grade production?

### Developer Expertise Matrix
Ask about the developer's familiarity with relevant technologies (Beginner, Intermediate, Advanced, Professional):
- Languages: TypeScript, Python, Go, Rust, C#, PHP, Java
- Frontend: Next.js, React, Vue, Nuxt, Svelte, Tailwind CSS
- Backend: Django, FastAPI, Express, NestJS, Go Gin, ASP.NET Core, Laravel
- Databases: PostgreSQL, MySQL, SQLite, MongoDB, Redis

## 2. Technology Recommendation Engine
Formulate the stack recommendation considering **developer expertise + technical suitability**:
- Never choose a stack purely based on theoretical hype if the developer lacks familiarity and time-to-market is critical.
- Provide trade-offs, risks, confidence level, and alternative stacks considered.

## 3. Initial Architecture Record & Project Memory
1. Create `.ai/project.json` and `.ai/` memory files (`INDEX.md`, `STACK.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `AGENT-CONTRACT.md`).
2. Write initial **ADR-001** recording chosen frameworks, databases, and rationale in `.ai/DECISIONS.md`.
3. Create root `AGENTS.md` referencing `.ai/INDEX.md`.
