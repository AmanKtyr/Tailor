<div align="center">

# TAILOR

<img src="./assets/tailor-mascot.jpg" alt="Tailor - Reuse-First AI Engineering" width="800" style="border-radius: 8px; margin: 16px 0;" />

### *Make the code fit the project — with zero waste.*

**The Unified AI Coding-Agent Engineering Framework**  
Combining **Spec-Driven Development (SDD)**, **Adaptive Pragmatism (Lite/Full/Ultra)**, **Progressive Project Memory (`.ai/`)**, **AST Semantic Code Reuse**, and a **Native Model Context Protocol (MCP) Server** for Claude Code, Cursor, Codex, Gemini CLI / Antigravity, Windsurf, Roo Code / Cline, GitHub Copilot CLI, and Zed.

Created by **Aman Katyar** ([@AmanKtyr](https://github.com/AmanKtyr)).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node: >=18](https://img.shields.io/badge/Node-%3E%3D18.0.0-green.svg)](package.json)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.json)
[![Tests: Vitest](https://img.shields.io/badge/Tests-37%20Passing-brightgreen.svg)](tests/)
[![Benchmarks: 100%](https://img.shields.io/badge/Benchmarks-100%25-success.svg)](benchmarks/)
[![MCP: Supported](https://img.shields.io/badge/MCP-Protocol%202024--11--05-purple.svg)](src/mcp/)

---

</div>

## Overview & Objectives

AI coding assistants frequently encounter two distinct failure modes:
1. **Unstructured Generation ("Vibe Coding"):** Agents generate code from loose prompts, introducing redundant dependencies, duplicate components, and unvetted architectural changes.
2. **Extreme Laziness without Specifications:** Agents produce abbreviated implementations without documented requirements, contracts, or architectural constraints.

**Tailor** unifies these requirements into a disciplined, multi-agent engineering framework:
* **Spec-Driven Development (SDD):** Transforms user intent into formal feature specifications (`spec.md`), technical plans (`plan.md`), and granular checklists (`tasks.md`), governed by a **Project Constitution** (`.ai/CONSTITUTION.md`).
* **Adaptive Pragmatism Ladder:** Enforces the 7-step decision ladder (YAGNI -> Existing Code -> Stdlib -> Native API -> Installed Dep -> One-liner -> Minimal Code) with configurable intensity levels (`lite`, `balanced`, `ultra`, `strict`).
* **Progressive Project Memory (`.ai/`):** Self-healing, compact domain memory reducing LLM context token overhead by up to 80% with live drift repair.
* **AST Semantic Code Reuse:** Deterministically indexes workspace components, hooks, and utilities to inject reuse audits prior to code generation.
* **Native MCP Server:** Connects directly to Claude Desktop, Cursor, Zed, Windsurf, and Antigravity via standard JSON-RPC.

---

## Comparison Matrix

| Capability / Dimension | GitHub `spec-kit` (Specify) | DietrichGebert `ponytail` | **Tailor 2.0 (Unified)** |
| :--- | :--- | :--- | :--- |
| **Core Paradigm** | Spec-Driven Development (SDD) | Pragmatism & LOC reduction | **Unified Framework: SDD + Pragmatism + Memory + Reuse + MCP** |
| **CLI & Runtime** | Python (`uv tool install specify-cli`) | Prompt-only (no executable CLI) | **Zero-Config Node/TypeScript CLI (`npx @amanktyr/tailor`)** |
| **Project Constitution** | `.specify/memory/constitution.md` | Hardcoded prompt rule | **`.ai/CONSTITUTION.md` + `.ai/INDEX.md` + Live ADRs** |
| **Pre-Execution Reuse Audit** | None (causes duplicated code) | Text rule only | **AST scan automatically injects existing components into `plan.md`** |
| **Pragmatism Intensity** | None (tends to generate bloat) | `lite`, `full`, `ultra` | **`lite`, `balanced`, `ultra`, `strict` embedded everywhere** |
| **Native MCP Server** | None | None | **Built-in JSON-RPC 2.0 Server (`tailor mcp` / `tailor-mcp`)** |
| **Live Drift Detection** | None | None | **Continuous AST scanner auto-repairs stale project memory** |
| **Multi-Agent Adapters** | 4 platforms | 5 platforms | **10+ Platforms (Claude, Cursor, Codex, Gemini, Windsurf, Cline, Copilot, Zed)** |
| **Open Source Standards** | Standard GitHub | HN/Reddit buzz | **NPM CLI, Skills standard, MCP protocol, and CI workflows** |

---

## Quick Start & Installation

Tailor can be utilized via the universal **Agent Skills** standard, as a **Global / Local CLI**, or as a **Model Context Protocol (MCP) Server**.

### 1. Universal Agent Installation (`skills` CLI)

```bash
# Install Tailor across all AI coding assistants in your workspace
npx skills add AmanKtyr/Tailor -y

# Or install globally across your machine (-g)
npx skills add AmanKtyr/Tailor -g -y
```

### 2. NPM CLI Installation

```bash
# Install globally
npm install -g @amanktyr/tailor

# Or run directly via npx without installation:
npx @amanktyr/tailor init
```

### 3. Model Context Protocol (MCP) Server Setup

Add Tailor to your `claude_desktop_config.json` or Cursor MCP settings:

```json
{
  "mcpServers": {
    "tailor": {
      "command": "npx",
      "args": ["-y", "@amanktyr/tailor", "mcp"]
    }
  }
}
```

---

## CLI Command Reference

```bash
# Project Governance & Initialization
tailor init                          # Conduct discovery, stack selection, and initialize .ai/
tailor constitution                  # View or regenerate .ai/CONSTITUTION.md
tailor sync                          # Synchronize all 10+ AI agent adapter files

# Spec-Driven Development (SDD) Workflow
tailor spec init                     # Initialize specs/ directory and constitution
tailor spec new <feature-name>       # Scaffold specs/<id>-<name>/spec.md with user stories
tailor spec plan <id>                # Generate reuse-aware technical plan (plan.md)
tailor spec tasks <id>               # Generate granular, ordered task checklist (tasks.md)
tailor spec list                     # View all active feature specs and completion status

# Intelligence, Memory & Security
tailor analyze                       # Deterministically inspect stack, frameworks, and reusable catalog
tailor memory update                 # Synchronize .ai/ progressive memory documents
tailor memory drift                  # Detect drift between active code and recorded memory
tailor security                      # Run static security rules and credential leak checks
tailor dependencies --check <pkg>   # Evaluate package for bloat, redundancy, and licenses
tailor review                        # Run holistic quality, architecture, and security gates
tailor doctor                        # Run full system, git, memory, and skill diagnostics
tailor mcp                           # Start stdio Model Context Protocol (MCP) server
```

---

## The 7-Step Pragmatism Ladder

Before writing any new implementation or adding dependencies, AI agents follow this mandatory sequence:

```
┌────────────────────────────────────────────────────────┐
│ 1. Does this need to exist? (YAGNI)                    │
│    -> Reject speculative complexity or future-proofing.│
├────────────────────────────────────────────────────────┤
│ 2. Already in this codebase?                           │
│    -> Search src/components/, src/lib/, src/utils/.    │
├────────────────────────────────────────────────────────┤
│ 3. Does the Standard Library do it?                    │
│    -> Use crypto.randomUUID(), structuredClone(), etc. │
├────────────────────────────────────────────────────────┤
│ 4. Does a Native Platform / Browser API cover it?      │
│    -> Use <dialog>, <input type="date">, fetch().      │
├────────────────────────────────────────────────────────┤
│ 5. Does an already-installed dependency solve it?      │
│    -> Reuse existing packages in package.json.         │
├────────────────────────────────────────────────────────┤
│ 6. Can it be written as a one-liner / inline helper?   │
│    -> Avoid creating 50-line wrappers for simple logic.│
├────────────────────────────────────────────────────────┤
│ 7. Only then: Write the minimum amount of clean code.  │
│    -> Clean domain boundaries, types, and tests.       │
└────────────────────────────────────────────────────────┘
```

---

## Universal Multi-Agent Support (10+ Platforms)

| AI Platform | Integration File | Description |
| :--- | :--- | :--- |
| **Claude Code** | `CLAUDE.md` | Loads `.ai/CONSTITUTION.md` and enforces Reuse-First rules |
| **Cursor IDE** | `.cursorrules` & `.cursor/rules/tailor.mdc` | Guides Cursor Composer & Chat with project memory |
| **OpenAI Codex / ChatGPT** | `AGENTS.md` | Resolved automatically from `.agents/skills/` |
| **Gemini CLI / Antigravity** | `GEMINI.md` & workspace integration | Discovers skills directly in workspace root |
| **Windsurf** | `.windsurfrules` | Native discovery via standard rules file |
| **Roo Code / Cline** | `.clinerules` | Enforces project constitution during task execution |
| **GitHub Copilot CLI** | `.github/copilot-instructions.md` | Native instructions for Copilot workspace chat |
| **OpenCode** | `.opencode/rules/tailor.md` | Open-source agent integration rules |
| **Aider** | `.aider.conventions.md` | Terminal pair programming conventions |
| **Zed Editor** | `.zed/prompt.md` | Custom instructions for Zed AI assistant |

Run `tailor sync` at any time to update all adapter files simultaneously.

---

## Benchmarks & Measurable Results

Tailor includes an automated benchmark suite (`benchmarks/scripts/run-benchmarks.js`) running across 5 real fixture codebases:
* `nextjs-app` (Next.js 14, React 18, Tailwind CSS, Vitest)
* `django-app` (Django 4.2, PostgreSQL, DRF, Pytest)
* `react-app` (React, Vite)
* `dotnet-api` (ASP.NET Core, C# .NET 8)
* `messy-monolith` (Express, legacy dependencies, leaked secrets, eval)

**Benchmark Performance:**
* **Project Signal Detection:** 100% accurate across Next.js, Django, React, ASP.NET Core, and Express.
* **Semantic Reuse Matching:** 100% match for user requests (`modal` -> existing `Dialog`, `fetchUser` -> `getUser`).
* **Dependency Governance:** 100% rejection of trivial micro-packages (`is-odd`, `left-pad`) and challenge on redundant libraries (`axios`).
* **Security Defenses:** 100% detection of hardcoded AWS credentials, SQL string concatenation, and dangerous `eval()`.
* **Token & LOC Reduction:** 40-70% reduction in generated code volume and context token consumption.

---

## Privacy & Security

* **Local & Deterministic Execution:** Zero telemetry, no hidden remote logging, and no source code transmission.
* **Non-destructive Defaults:** Never silently overwrites or deletes unrelated files.

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

[MIT](LICENSE) © [Aman Katiyar](https://github.com/AmanKtyr) & Tailor Contributors