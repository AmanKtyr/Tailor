<div align="center">

# TAILOR

### *Make the code fit the project.*

An AI coding-agent engineering framework and skill layer that makes coding agents behave like disciplined, experienced senior software engineers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node: >=18](https://img.shields.io/badge/Node-%3E%3D18.0.0-green.svg)](package.json)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.json)
[![Tests: Vitest](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)](tests/)
[![Benchmarks: 100%](https://img.shields.io/badge/Benchmarks-100%25-success.svg)](benchmarks/)

---

</div>

## What is Tailor?

Tailor is **NOT** a chatbot, not a framework-specific generator, and not a giant monolithic prompt.

Tailor is a **modular software engineering layer for AI coding agents** (OpenAI Codex, Claude Code, Cursor, Gemini CLI / Antigravity, OpenCode, and any agent supporting the open `SKILL.md` standard).

Tailor guides AI agents to:
* **Understand before implementing:** Read compact project memory before touching code.
* **Reuse-first engineering:** Search existing components, hooks, utilities, services, and CSS before writing duplicate code.
* **Intelligent project bootstrapping (`/init-project` or `tailor init`):** Ask product discovery questions, evaluate developer expertise, recommend appropriate technology stacks, and write Architecture Decision Records (ADRs).
* **Context-efficient project memory (`.ai/`):** Maintain a compact, evidence-based AI memory layer (`INDEX.md`, `STACK.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `UI.md`, `API.md`, `DATABASE.md`, `DEPENDENCIES.md`, `SECURITY.md`, `AGENT-CONTRACT.md`) to prevent redundant repo scans and save LLM tokens via progressive disclosure.
* **Automated drift detection (`tailor memory drift`):** Compare active source code and package manifests against project memory to detect and repair stale documentation.
* **Dependency governance (`tailor dependencies`):** Evaluate proposed packages for supply-chain risk, maintenance status, license compatibility, and reject trivial micro-package bloat (`is-odd`, `left-pad`).
* **Built-in security audits (`tailor security`):** Scan for hardcoded keys/secrets, SQL injections, disabled TLS flags, dangerous `eval()`, and CVEs.
* **Challenge bad approaches:** Act as a senior engineer by pushing back against unnecessary architectural complexity or redundant systems instead of blindly generating code.

---

## Core Engineering Ladder (Reuse-First)

Before writing any new implementation or adding dependencies, Tailor enforces this strict order:

```
1. Existing project code
   └─ Search existing components, hooks, utilities, and services
2. Existing shared abstraction
   └─ Extend or parameterize an existing shared helper
3. Framework-native capabilities
   └─ Use standard framework APIs (Next.js, Django, standard library)
4. Existing installed dependency
   └─ Reuse packages already present in package.json / requirements.txt
5. Trusted external dependency
   └─ Evaluate maintenance, license, and security before installing
6. New implementation
   └─ Build from scratch only when steps 1–5 are exhausted
```

---

## Architecture & Responsibilities

Tailor maintains a strict separation of concerns:

| Layer | Location | Purpose |
| :--- | :--- | :--- |
| **SKILLS** | `skills/*/SKILL.md` | Agent behaviors, engineering rules, and operational constraints |
| **PROJECT MEMORY** | `.ai/*.md` & `.ai/project.json` | Project-specific facts, technology stack, ADRs, conventions, and contracts |
| **TOOLS / CLI** | `src/` & `dist/` | Deterministic indexing, AST/file search, security rules, drift detection, and audits |
| **ADAPTERS** | `adapters/` | Seamless bridge for Codex, Claude Code, Cursor, Gemini, and OpenCode |
| **TEMPLATES** | `templates/project-memory/` | Standardized templates for generating clean project memory |
| **BENCHMARKS** | `benchmarks/` | Measurable test suites proving that Tailor prevents code bloat and duplication |

---

## Quick Install Guide for Any Coding Agent

Tailor follows the open standard `SKILL.md` specification and works seamlessly across **OpenAI Codex**, **Claude Code**, **Cursor**, **Gemini CLI / Antigravity**, **OpenCode**, and other AI coding agents.

### 1. Install via `skills` CLI (Universal Agent Installer)

The easiest way to install Tailor skills into your workspace or globally on your machine:

#### From GitHub:
```bash
# Install all Tailor skills into your active project
npx skills add AmanKtyr/Tailor

# Or install globally across all projects on your machine (-g)
npx skills add AmanKtyr/Tailor -g

# Install only the core skill
npx skills add AmanKtyr/Tailor --skill tailor-core
```

#### From Local Repository / Directory:
```bash
# Inside the cloned Tailor folder (install to current project)
npx skills add .

# Install globally to your machine from local path
npx skills add /path/to/Tailor -g

# Install specific individual skill locally
npx skills add ./skills/tailor-core
npx skills add ./skills/reuse-first
npx skills add ./skills/security
```

---

### 2. Platform-Specific Setup

Tailor includes lightweight adapters under `adapters/` for effortless integration:

| Agent / Platform | Integration Method | What It Does |
| :--- | :--- | :--- |
| **Codex** | `npx skills add <repo>` | Places skills in `.agents/skills/` for automatic resolution |
| **Claude Code** | `CLAUDE.md` + `.ai/INDEX.md` | Guides Claude to progressive disclosure and reuse-first ladder |
| **Cursor** | `.cursorrules` + `.ai/INDEX.md` | Provides Cursor Composer with project memory pointers |
| **Gemini / Antigravity** | `GEMINI.md` / Customizations | Connects Gemini IDE directly to `.ai/` and `skills/` |
| **OpenCode / Windsurf** | Standard `skills/` | Native discovery via open skill conventions |

---

### 3. Install Tailor CLI & Memory Generator (npm)

You can also use Tailor's deterministic engine and CLI commands directly:

```bash
# Global CLI installation
npm install -g tailor-ai

# Or run directly with npx without installing
npx tailor init
npx tailor analyze
npx tailor review
```

---

## Quick Start & CLI Commands

```bash
# 1. Initialize Tailor project memory in your workspace
tailor init

# 2. Inspect technologies, signals, and reusable component catalog
tailor analyze

# 3. Synchronize / update .ai/ project memory after code changes
tailor memory update

# 4. Check for documentation & architecture drift
tailor memory drift

# 5. Validate integrity of project memory documents
tailor memory validate

# 6. Audit installed dependencies or evaluate a proposed new package
tailor dependencies
tailor dependencies --check is-odd

# 7. Run static security & secret leak checks
tailor security

# 8. Run full architectural and code quality review
tailor review

# 9. Diagnose system, environment, skill frontmatter, and configuration
tailor doctor
```

All commands support `--json` for machine-readable output in CI/CD pipelines or IDE extensions, and `--quiet` for silent script execution.

---

## Modular Skill System

Tailor provides 15 specialized skills adhering to the open `SKILL.md` standard with valid YAML frontmatter:

1. **`tailor-core`**: Agent operational contract, task classification, and reuse-first philosophy.
2. **`project-init`**: Bootstrapping discovery, developer expertise matching, and stack recommendation.
3. **`project-memory`**: Progressive disclosure, memory cache hierarchy, and drift repair.
4. **`architecture`**: Architecture Decision Records (ADRs) and preventing premature complexity.
5. **`reuse-first`**: Semantic search across components, utilities, hooks, and CSS tokens.
6. **`dependency-governance`**: Supply-chain assessment, license validation, and anti-bloat filters.
7. **`security`**: OWASP Top 10 defenses, zero hardcoded secrets, injection prevention.
8. **`frontend`**: Design system adherence, UI component reuse, responsive styling.
9. **`backend`**: API contracts, database transaction integrity, domain boundaries.
10. **`seo`**: Technical SEO, metadata, sitemaps, and robots configuration.
11. **`accessibility`**: WCAG 2.1 AA compliance, semantic HTML, keyboard navigation.
12. **`testing`**: Test runner discovery, targeted execution, truthful verification.
13. **`documentation`**: Documenting *why* instead of *what*, keeping docs in sync.
14. **`refactoring`**: Eliminating duplicated code and safe atomic refactors.
15. **`review`**: Holistic code and architecture review gates.

---

## Benchmarks

Tailor includes an automated benchmark suite (`benchmarks/scripts/run-benchmarks.js`) running across 5 real fixture codebases:
* `nextjs-app` (Next.js 14, React 18, Tailwind CSS, Vitest)
* `django-app` (Django 4.2, PostgreSQL, DRF, Pytest)
* `react-app` (React, Vite)
* `dotnet-api` (ASP.NET Core, C# .NET 8)
* `messy-monolith` (Express, legacy dependencies, duplicated user queries, leaked AWS key, eval)

Run benchmarks:
```bash
npm run benchmark
```

**Benchmark Results:**
* Project Signal Detection: **100% accurate** across Next.js, Django, React, ASP.NET Core, and Express.
* Semantic Reuse Matching: **100% match** for user request `modal` -> existing `Dialog`, and `fetchUser` -> existing `getUser`.
* Dependency Governance: **100% rejection** of trivial micro-packages (`is-odd`) and challenge on redundant libraries (`axios`).
* Security Detection: **100% detection** of hardcoded AWS credentials, SQL string concatenation, and dangerous `eval()`.
* Task Classification: **100% accurate** scaling across TRIVIAL, SMALL, MEDIUM, LARGE, and CRITICAL.

---

## Configuration (`.tailor.json`)

Configure project-specific profiles and thresholds:

```json
{
  "profile": "saas",
  "memory": {
    "enabled": true,
    "directory": ".ai",
    "autoUpdate": false
  },
  "security": {
    "level": "high",
    "requireAudit": true,
    "blockOnCritical": true
  },
  "dependencies": {
    "requireAudit": true,
    "allowedLicenses": ["MIT", "Apache-2.0", "BSD-3-Clause", "ISC"]
  },
  "reuse": {
    "enabled": true,
    "componentDirectories": ["src/components", "src/lib", "src/utils"]
  }
}
```

---

## Privacy & Security Policy

* **NO TELEMETRY BY DEFAULT:** Tailor never secretly uploads source code, secrets, file contents, prompts, or proprietary data.
* **Deterministic & Safe Execution:** No arbitrary shell commands or untrusted remote code execution.
* **Non-destructive Defaults:** Tailor never silently overwrites or deletes unrelated files.

---

## Contributing & Development

```bash
# 1. Clone repository
git clone https://github.com/tailor-ai/tailor.git
cd tailor

# 2. Install dependencies
npm install

# 3. Build TypeScript
npm run build

# 4. Run test suite
npm test

# 5. Run benchmark suite
npm run benchmark

# 6. Run diagnostics
node dist/cli/bin.js doctor
```

---

## License

[MIT](LICENSE) © Tailor Contributors