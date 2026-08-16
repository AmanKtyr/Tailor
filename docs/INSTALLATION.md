# Tailor Installation Guide for Any Coding Agent

This guide shows how to install Tailor skills and tooling into any AI coding environment.

---

## 1. Universal Agent Installation (`npx skills add`)

The `skills` CLI works with any agent supporting the open `SKILL.md` format (OpenAI Codex, Claude Code, Cursor, Gemini CLI, OpenCode, etc.).

### Option A: From Local Cloned Folder
If you have cloned the Tailor repository on your machine:

```bash
# Inside the Tailor directory: install to current workspace
npx skills add .

# Install globally to your machine (available across all projects)
npx skills add . -g

# Install a specific specialized skill
npx skills add ./skills/tailor-core
npx skills add ./skills/reuse-first
npx skills add ./skills/security
```

### Option B: From GitHub
Once published to GitHub:

```bash
# Install all skills into your active project
npx skills add AmanKtyr/Tailor

# Install globally
npx skills add AmanKtyr/Tailor -g

# Install a specific skill
npx skills add AmanKtyr/Tailor --skill tailor-core
```

---

## 2. Agent-Specific Instructions

### OpenAI Codex
Codex automatically detects skills located in `.agents/skills/` or `skills/`:
```bash
npx skills add <source>
```

### Claude Code
1. Run `tailor init` to generate `.ai/` and `CLAUDE.md`.
2. Claude Code will automatically consult `.ai/INDEX.md` and follow the Reuse-First engineering ladder.

### Cursor IDE
1. Run `tailor init` to generate `.cursorrules` pointing to `.ai/INDEX.md`.
2. Cursor Composer and Chat will adhere to your architecture decisions and conventions.

### Gemini CLI / Antigravity
1. Run `tailor init` to generate `GEMINI.md` and `.ai/` project memory.
2. Skills in `skills/` or `.agents/skills/` are discovered automatically.

### OpenCode & Windsurf
1. Skills are placed under `skills/` or `.skills/` adhering to standard frontmatter conventions.

---

## 3. Tailor CLI Commands

```bash
# Initialize project memory & agent contracts
tailor init

# Inspect technologies and reusable component catalog
tailor analyze

# Synchronize memory after code modifications
tailor memory update

# Check for memory drift
tailor memory drift

# Run security & secret leak audit
tailor security

# Evaluate a proposed dependency before installing
tailor dependencies --check <package-name>

# Comprehensive engineering review
tailor review

# System & skill diagnostics
tailor doctor
```
