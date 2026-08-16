<div align="center">

# TAILOR

### *Make the code fit the project.*

An open-source software engineering discipline framework and skill for AI coding assistants (Claude Code, Cursor, OpenAI Codex, and Gemini CLI / Antigravity) created by **Aman Katyar** ([@AmanKtyr](https://github.com/AmanKtyr)).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node: >=18](https://img.shields.io/badge/Node-%3E%3D18.0.0-green.svg)](package.json)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.json)
[![Tests: Vitest](https://img.shields.io/badge/Tests-18%20Passing-brightgreen.svg)](tests/)
[![Benchmarks: 100%](https://img.shields.io/badge/Benchmarks-100%25-success.svg)](benchmarks/)

---

</div>

## Overview

The **Tailor skill** is an open-source productivity and engineering discipline plugin for AI coding assistants (like Claude Code, Cursor, Codex, and Gemini) created by **Aman Katyar** ([@AmanKtyr](https://github.com/AmanKtyr)). It forces AI coding agents to act like disciplined senior software engineers, eliminating bloated, over-engineered code, enforcing a strict reuse-first engineering ladder, maintaining compact AI project memory (`.ai/`), and rejecting unnecessary dependencies and security anti-patterns.

---

## How Tailor Works

* **The Reuse-First Decision Ladder:** Forces the AI agent to search existing project components, utilities, hooks, and CSS before drafting new code, cutting down redundant implementations.
* **Progressive Project Memory (`.ai/`):** Generates and maintains compact, evidence-based project memory (`INDEX.md`, `STACK.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `SECURITY.md`) to save up to 80% repetitive LLM context tokens.
* **Automated Drift Detection:** Continuously compares active source code and package manifests against project memory to detect and repair stale documentation automatically.
* **Dependency Governance:** Rejects trivial micro-package bloat (like `is-odd`, `left-pad`) and evaluates supply-chain security, maintenance status, and license compatibility before installing packages.
* **Security & Vulnerability Defenses:** Statically detects hardcoded secrets/API keys, SQL string concatenation, disabled TLS flags, and dangerous `eval()` calls.
* **Efficiency & Token Gains:** Benchmarks demonstrate 100% accurate component reuse matching and significant reduction in generated code volume and LLM token consumption.

---

## Key Commands & Features

| Command | Action & What It Does |
| :--- | :--- |
| `tailor init` / `/init-project` | Conducts product discovery, developer expertise assessment, stack recommendation, and ADR generation |
| `tailor analyze` / `/analyze-project` | Deterministically inspects workspace signals, frameworks, databases, and reusable component catalog |
| `tailor memory update` | Synchronizes and regenerates `.ai/` project memory layer based on current source code state |
| `tailor memory drift` | Detects divergence between active code and recorded project memory documents |
| `tailor security` / `/security-audit` | Runs static security rules, credential leak checks, and dependency vulnerability scans |
| `tailor dependencies --check <pkg>` | Evaluates proposed packages for bloat, redundancy, and license compatibility |
| `tailor review` / `/review` | Runs holistic architecture, reuse, security, and quality review gates |
| `tailor doctor` | Diagnoses Node runtime, Git status, memory integrity, and skill frontmatter |

---

## Quick Install Guide for Any Coding Agent

Tailor follows the open standard `SKILL.md` specification and works out-of-the-box across **OpenAI Codex**, **Claude Code**, **Cursor**, **Gemini CLI / Antigravity**, and **OpenCode**.

### 1. Install via `skills` CLI (Universal Agent Installer)

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

### 2. Platform-Specific Integration

Tailor includes lightweight adapters under `adapters/` for effortless integration:

| Agent / Platform | Integration Method | What It Does |
| :--- | :--- | :--- |
| **Codex** | `npx skills add AmanKtyr/Tailor` | Discovers skills in `.agents/skills/` for automatic resolution |
| **Claude Code** | `CLAUDE.md` + `.ai/INDEX.md` | Directs Claude to progressive disclosure and reuse-first ladder |
| **Cursor** | `.cursorrules` + `.ai/INDEX.md` | Connects Cursor Composer with project memory pointers |
| **Gemini / Antigravity** | `GEMINI.md` / Customizations | Connects Gemini IDE directly to `.ai/` and `skills/` |
| **OpenCode / Windsurf** | Standard `skills/` | Native discovery via open skill frontmatter conventions |

---

### 3. Install Tailor CLI (npm)

```bash
# Global CLI installation
npm install -g tailor-ai

# Or run directly via npx
npx tailor init
npx tailor analyze
npx tailor review
```

---

## Modular Skill Architecture

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

## Benchmarks & Measurable Results

Tailor includes an automated benchmark suite (`benchmarks/scripts/run-benchmarks.js`) running across 5 real fixture codebases:
* `nextjs-app` (Next.js 14, React 18, Tailwind CSS, Vitest)
* `django-app` (Django 4.2, PostgreSQL, DRF, Pytest)
* `react-app` (React, Vite)
* `dotnet-api` (ASP.NET Core, C# .NET 8)
* `messy-monolith` (Express, legacy dependencies, duplicated user queries, leaked AWS key, eval)

**Benchmark Results:**
* Project Signal Detection: **100% accurate** across Next.js, Django, React, ASP.NET Core, and Express.
* Semantic Reuse Matching: **100% match** for user request `modal` -> existing `Dialog`, and `fetchUser` -> existing `getUser`.
* Dependency Governance: **100% rejection** of trivial micro-packages (`is-odd`) and challenge on redundant libraries (`axios`).
* Security Detection: **100% detection** of hardcoded AWS credentials, SQL string concatenation, and dangerous `eval()`.
* Task Classification: **100% accurate** scaling across TRIVIAL, SMALL, MEDIUM, LARGE, and CRITICAL.

Run benchmarks locally:
```bash
npm run benchmark
```

---

## Configuration (`.tailor.json`)

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
git clone https://github.com/AmanKtyr/Tailor.git
cd Tailor
npm install
npm run build
npm test
npm run benchmark
node dist/cli/bin.js doctor
```

---

## License

[MIT](LICENSE) © [Aman Katyar](https://github.com/AmanKtyr) & Tailor Contributors