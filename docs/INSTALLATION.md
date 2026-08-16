# Tailor Installation Guide for Any Coding Agent

Tailor supports **all major AI coding agents** via the open standard `skills` CLI, as well as direct terminal CLI usage via **NPM**.

---

## 📦 1. Universal Agent Installation (`skills` CLI)

One single command installs Tailor across **all AI coding assistants** (Claude Code, Cursor, OpenAI Codex, Gemini CLI, Windsurf, OpenCode):

```bash
# Install Tailor into your active project workspace
npx skills add AmanKtyr/Tailor -y

# Or install globally across all projects on your machine (-g)
npx skills add AmanKtyr/Tailor -g -y

# Install only the core skill
npx skills add AmanKtyr/Tailor --skill tailor-core -y
```

| Supported Agent | Behavior |
| :--- | :--- |
| 🟣 **Claude Code** | Automatically loads `.ai/INDEX.md` and enforces Reuse-First ladder |
| 🔵 **Cursor IDE** | Guides Cursor Composer & Chat via `.cursorrules` and project memory |
| 🟢 **OpenAI Codex** | Resolved automatically from `.agents/skills/` |
| 🟡 **Gemini CLI / Antigravity** | Discovers skills directly via workspace integration |
| 🌊 **Windsurf / OpenCode** | Native discovery via standard `SKILL.md` frontmatter |

---

## 💻 2. Installation via NPM (CLI & Local Project)

If you want to use Tailor's deterministic CLI tools (`analyze`, `memory`, `security`, `doctor`, `review`) in your terminal or CI/CD pipelines:

### Global CLI Installation:
```bash
npm install -g @amanktyr/tailor

# Now run tailor commands anywhere:
tailor init
tailor analyze
tailor review
tailor security
tailor doctor
```

### Local Project Installation (Dev Dependency):
```bash
# Install into your project
npm install --save-dev @amanktyr/tailor

# Run via npx without global install:
npx @amanktyr/tailor init
npx @amanktyr/tailor analyze
npx @amanktyr/tailor review
```

### Run Directly without Installing:
```bash
npx @amanktyr/tailor init
```

---

## 📂 3. Installation from Local Cloned Repository

If you cloned this repository locally:
```bash
# Inside the cloned Tailor directory:
npx skills add . -y

# Install a specific individual skill only:
npx skills add ./skills/tailor-core -y
npx skills add ./skills/reuse-first -y
npx skills add ./skills/security -y
```
