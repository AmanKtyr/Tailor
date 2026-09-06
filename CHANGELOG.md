# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-09-06

### Added
- **Dedicated Skills Management (`tailor skills` CLI):**
  - Added `tailor skills list` to display all available skills and `.agents/skills/` sync status.
  - Added `tailor skills sync` to mirror skills across the workspace.
  - Added `tailor skills info <name>` to view directives for any target skill.
- **MCP Server Skills Tools:**
  - Added `tailor_skills_list` and `tailor_skill_get` for on-demand skill retrieval in Claude Desktop, Cursor, and Zed.
- **Strict Non-Negotiable Guardrails:**
  - Added **Zero Unrequested Styling Guardrail** prohibiting unsolicited CSS, Tailwind classes, colors, gradients, and animations.
  - Added **Zero Bloat & Minimal Diff Discipline (Anti-Slop)** prohibiting speculative wrappers, mock data, and filler comments.
  - Added **Cold-Start Resilience** ensuring proper fallback when `.ai/` is not yet initialized.
- **Enhanced Skills Instructions:**
  - Upgraded core skills (`backend`, `security`, `testing`, `refactoring`, `dependency-governance`, `frontend`, `pragmatism`) with step-by-step checklists, Anti-Pattern code contrasts, and high-affinity intent triggers for Gemini 3.8 and GPT-4o.
- **Diagnostics & Packaging:**
  - Added diagnostic check in `tailor doctor` for `.agents/skills` synchronization.
  - Included `.agents` in npm package distribution.

## [0.1.0] - 2026-08-16

### Added
- **Core Engine & Architecture:**
  - Modular skill architecture following open `SKILL.md` specifications with valid YAML frontmatter.
  - Task complexity classifier scaling across `TRIVIAL`, `SMALL`, `MEDIUM`, `LARGE`, and `CRITICAL`.
  - Reuse-First engineering ladder and semantic duplicate detection system.
- **Deterministic Tooling & Indexer:**
  - Multi-ecosystem project scanner supporting Node.js, Python, Go, Rust, PHP, .NET C#, Docker, and CI.
  - Project component cataloger extracting components, hooks, utilities, services, and types.
- **Project Memory System (`.ai/`):**
  - Progressive disclosure AI index (`INDEX.md`) and specialized memory files.
  - Machine-readable `.ai/project.json` for deterministic IDE and agent tooling.
  - Automated drift detection comparing memory against source code reality.
- **Dependency Governance & Security Auditing:**
  - Anti-bloat filter rejecting trivial micro-packages (`is-odd`, `left-pad`, `clone-deep`).
  - Integration with `npm audit` and `pip-audit`.
  - Built-in static security scanner for hardcoded keys, SQL injections, disabled TLS, and `eval()`.
- **CLI & Adapters:**
  - Complete CLI commands: `init`, `analyze`, `memory`, `security`, `dependencies`, `review`, `doctor`.
  - Cross-agent adapters for Codex, Claude Code, Cursor, Gemini, and OpenCode.
- **Benchmarks & Test Suite:**
  - 12 comprehensive benchmark tasks across 5 real fixture codebases.
  - Automated Vitest unit and integration test suites.
