import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AdapterSyncResult, AgentPlatform, PlatformAdapter } from './types.js';

export const SHARED_AGENT_INSTRUCTIONS = `# AI Agent Guidance (Powered by Tailor)

This repository uses **Tailor** for project intelligence, Spec-Driven Development, and Reuse-First engineering discipline.

## Non-Negotiable Directives

### 1. Cold-Start & Project Memory Hierarchy
- Always consult [\`.ai/CONSTITUTION.md\`](.ai/CONSTITUTION.md) and [\`.ai/INDEX.md\`](.ai/INDEX.md) first before planning or making non-trivial modifications.
- **Cold-Start Fallback:** If the \`.ai/\` directory does not exist yet, do NOT invent arbitrary conventions. Inspect \`package.json\` (or workspace manifests) and active source files directly to determine established patterns, and suggest running \`npx @amanktyr/tailor init\` to establish project memory.

### 2. Mandatory Guardrail: Zero Unrequested Styling & Redesign
- **STRICTLY PROHIBITED:** NEVER add, alter, or inject CSS, styling frameworks, inline styles, gradients, glassmorphism, or animations unless the user explicitly requested visual or styling changes.
- When working on logic, bugfixes, refactoring, or state management: preserve existing visual markup and styling tokens untouched.
- When writing UI components: strictly reuse existing design tokens, components, and CSS classes from the codebase or \`.ai/UI.md\`. Never invent new arbitrary classes, hex colors, or custom styling rules.
- If the project has no styling system and no styling is requested, output clean, unstyled semantic HTML.

### 3. Mandatory Guardrail: Zero Bloat & Minimal Diff Discipline (Anti-Slop)
- Implement **only** the minimal code required to satisfy the user's specific request.
- **NO speculative abstractions:** Do not create premature wrapper classes, generic factories, or speculative interfaces for one-off operations.
- **NO dummy/mock data:** Never add mock datasets, fake user lists, or placeholder fixtures in production code.
- **NO filler comments:** Never write redundant explanatory comments (e.g. \`// Here we define the function\`) that state the obvious. Only document *why* non-obvious business logic or security decisions exist.

### 4. Reuse-First Decision Ladder
Before writing any new function, hook, utility, or component, execute this sequence:
1. **YAGNI:** Does this truly need to exist? If speculative, reject it.
2. **Reuse:** Search the codebase (\`src/components/\`, \`src/utils/\`, \`src/hooks/\`) for matching or similar implementations (>=70% semantic similarity: extend or parameterize instead of duplicating).
3. **Standard Library:** Use native standard library / browser APIs (e.g. \`crypto.randomUUID()\`, \`structuredClone()\`, \`fetch()\`) instead of external micro-packages.
4. **Existing Dependencies:** Prefer already-installed dependencies over introducing new packages.
5. **Minimal Custom Code:** Only write new code when no existing primitive or component solves the requirement.

### 5. Spec-Driven Discipline
- For non-trivial features or multi-step tasks, follow the specification lifecycle (\`specs/<id>/spec.md\` -> \`plan.md\` -> \`tasks.md\`).

### 6. Truthful Verification
- Run targeted tests and verify changes before completion. Never fabricate test passes or security claims without running the verification command and confirming exit code 0.
`;

function copyDirSync(src: string, dest: string): string[] {
  const written: string[] = [];
  if (!fs.existsSync(src)) return written;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      written.push(...copyDirSync(srcPath, destPath));
    } else {
      fs.copyFileSync(srcPath, destPath);
      written.push(destPath);
    }
  }
  return written;
}

export function syncSkillsToAgentsFolder(workspaceRoot: string, customSkillsDir?: string): string[] {
  const targetDir = path.join(workspaceRoot, '.agents', 'skills');
  let sourceDir = customSkillsDir;

  if (!sourceDir || !fs.existsSync(sourceDir)) {
    // Check workspace root skills/
    const workspaceSkills = path.join(workspaceRoot, 'skills');
    if (fs.existsSync(workspaceSkills)) {
      sourceDir = workspaceSkills;
    } else {
      // Check package bundled skills
      try {
        const pkgSkills = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../skills');
        if (fs.existsSync(pkgSkills)) {
          sourceDir = pkgSkills;
        }
      } catch {
        // ignore
      }
    }
  }

  if (!sourceDir || !fs.existsSync(sourceDir) || path.resolve(sourceDir) === path.resolve(targetDir)) {
    return [];
  }

  return copyDirSync(sourceDir, targetDir);
}

export class CodexAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'codex';
  public displayName = 'Codex / ChatGPT';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.agents')) || fs.existsSync(path.join(workspaceRoot, 'skills'));
  }

  public async sync(workspaceRoot: string, skillsDir?: string): Promise<AdapterSyncResult> {
    const agentsFile = path.join(workspaceRoot, 'AGENTS.md');
    fs.writeFileSync(agentsFile, SHARED_AGENT_INSTRUCTIONS, 'utf8');

    const copiedSkills = syncSkillsToAgentsFolder(workspaceRoot, skillsDir);

    return {
      platform: 'codex',
      targetPath: agentsFile,
      filesWritten: [agentsFile, ...copiedSkills],
      status: 'SUCCESS',
      notes: 'AGENTS.md and .agents/skills synchronized.',
    };
  }
}

export class ClaudeAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'claude';
  public displayName = 'Claude Code';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, 'CLAUDE.md'));
  }

  public async sync(workspaceRoot: string): Promise<AdapterSyncResult> {
    const claudePath = path.join(workspaceRoot, 'CLAUDE.md');
    fs.writeFileSync(claudePath, SHARED_AGENT_INSTRUCTIONS, 'utf8');
    return {
      platform: 'claude',
      targetPath: claudePath,
      filesWritten: [claudePath],
      status: 'SUCCESS',
      notes: 'CLAUDE.md linked to Tailor project memory & constitution.',
    };
  }
}

export class CursorAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'cursor';
  public displayName = 'Cursor';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.cursorrules')) || fs.existsSync(path.join(workspaceRoot, '.cursor'));
  }

  public async sync(workspaceRoot: string): Promise<AdapterSyncResult> {
    const cursorPath = path.join(workspaceRoot, '.cursorrules');
    const cursorRulesDir = path.join(workspaceRoot, '.cursor', 'rules');
    if (!fs.existsSync(cursorRulesDir)) {
      fs.mkdirSync(cursorRulesDir, { recursive: true });
    }

    const cursorMdcPath = path.join(cursorRulesDir, 'tailor.mdc');
    const mdcContent = `---
description: Tailor Reuse-First, Zero-Bloat, and Spec-Driven rules
globs: *
---
${SHARED_AGENT_INSTRUCTIONS}
`;

    fs.writeFileSync(cursorPath, SHARED_AGENT_INSTRUCTIONS, 'utf8');
    fs.writeFileSync(cursorMdcPath, mdcContent, 'utf8');

    return {
      platform: 'cursor',
      targetPath: cursorPath,
      filesWritten: [cursorPath, cursorMdcPath],
      status: 'SUCCESS',
      notes: '.cursorrules and .cursor/rules/tailor.mdc synchronized.',
    };
  }
}

export class GeminiAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'gemini';
  public displayName = 'Gemini CLI / Antigravity';

  public detect(workspaceRoot: string): boolean {
    return (
      fs.existsSync(path.join(workspaceRoot, 'GEMINI.md')) ||
      fs.existsSync(path.join(workspaceRoot, '.agents')) ||
      fs.existsSync(path.join(workspaceRoot, 'skills'))
    );
  }

  public async sync(workspaceRoot: string, skillsDir?: string): Promise<AdapterSyncResult> {
    const geminiPath = path.join(workspaceRoot, 'GEMINI.md');
    fs.writeFileSync(geminiPath, SHARED_AGENT_INSTRUCTIONS, 'utf8');

    const copiedSkills = syncSkillsToAgentsFolder(workspaceRoot, skillsDir);

    return {
      platform: 'gemini',
      targetPath: geminiPath,
      filesWritten: [geminiPath, ...copiedSkills],
      status: 'SUCCESS',
      notes: 'GEMINI.md and .agents/skills synchronized for Gemini CLI & Antigravity.',
    };
  }
}

export class WindsurfAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'windsurf';
  public displayName = 'Windsurf';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.windsurfrules'));
  }

  public async sync(workspaceRoot: string): Promise<AdapterSyncResult> {
    const windsurfPath = path.join(workspaceRoot, '.windsurfrules');
    fs.writeFileSync(windsurfPath, SHARED_AGENT_INSTRUCTIONS, 'utf8');
    return {
      platform: 'windsurf',
      targetPath: windsurfPath,
      filesWritten: [windsurfPath],
      status: 'SUCCESS',
      notes: '.windsurfrules created and synchronized.',
    };
  }
}

export class ClineAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'cline';
  public displayName = 'Roo Code / Cline';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.clinerules'));
  }

  public async sync(workspaceRoot: string): Promise<AdapterSyncResult> {
    const clinePath = path.join(workspaceRoot, '.clinerules');
    fs.writeFileSync(clinePath, SHARED_AGENT_INSTRUCTIONS, 'utf8');
    return {
      platform: 'cline',
      targetPath: clinePath,
      filesWritten: [clinePath],
      status: 'SUCCESS',
      notes: '.clinerules created and synchronized.',
    };
  }
}

export class CopilotAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'copilot';
  public displayName = 'GitHub Copilot CLI';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.github', 'copilot-instructions.md'));
  }

  public async sync(workspaceRoot: string): Promise<AdapterSyncResult> {
    const githubDir = path.join(workspaceRoot, '.github');
    if (!fs.existsSync(githubDir)) {
      fs.mkdirSync(githubDir, { recursive: true });
    }
    const copilotPath = path.join(githubDir, 'copilot-instructions.md');
    fs.writeFileSync(copilotPath, SHARED_AGENT_INSTRUCTIONS, 'utf8');
    return {
      platform: 'copilot',
      targetPath: copilotPath,
      filesWritten: [copilotPath],
      status: 'SUCCESS',
      notes: '.github/copilot-instructions.md created.',
    };
  }
}

export class OpenCodeAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'opencode';
  public displayName = 'OpenCode';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.opencode'));
  }

  public async sync(workspaceRoot: string): Promise<AdapterSyncResult> {
    const opencodeRulesDir = path.join(workspaceRoot, '.opencode', 'rules');
    if (!fs.existsSync(opencodeRulesDir)) {
      fs.mkdirSync(opencodeRulesDir, { recursive: true });
    }
    const rulePath = path.join(opencodeRulesDir, 'tailor.md');
    fs.writeFileSync(rulePath, SHARED_AGENT_INSTRUCTIONS, 'utf8');
    return {
      platform: 'opencode',
      targetPath: rulePath,
      filesWritten: [rulePath],
      status: 'SUCCESS',
      notes: '.opencode/rules/tailor.md created.',
    };
  }
}

export class AiderAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'aider';
  public displayName = 'Aider';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.aider.conf.yml'));
  }

  public async sync(workspaceRoot: string): Promise<AdapterSyncResult> {
    const aiderPath = path.join(workspaceRoot, '.aider.conventions.md');
    fs.writeFileSync(aiderPath, SHARED_AGENT_INSTRUCTIONS, 'utf8');
    return {
      platform: 'aider',
      targetPath: aiderPath,
      filesWritten: [aiderPath],
      status: 'SUCCESS',
      notes: '.aider.conventions.md synchronized.',
    };
  }
}

export class ZedAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'zed';
  public displayName = 'Zed Editor';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.zed'));
  }

  public async sync(workspaceRoot: string): Promise<AdapterSyncResult> {
    const zedDir = path.join(workspaceRoot, '.zed');
    if (!fs.existsSync(zedDir)) {
      fs.mkdirSync(zedDir, { recursive: true });
    }
    const zedPromptPath = path.join(zedDir, 'prompt.md');
    fs.writeFileSync(zedPromptPath, SHARED_AGENT_INSTRUCTIONS, 'utf8');
    return {
      platform: 'zed',
      targetPath: zedPromptPath,
      filesWritten: [zedPromptPath],
      status: 'SUCCESS',
      notes: '.zed/prompt.md synchronized.',
    };
  }
}

export class AdapterManager {
  private adapters: PlatformAdapter[] = [
    new CodexAdapter(),
    new ClaudeAdapter(),
    new CursorAdapter(),
    new GeminiAdapter(),
    new WindsurfAdapter(),
    new ClineAdapter(),
    new CopilotAdapter(),
    new OpenCodeAdapter(),
    new AiderAdapter(),
    new ZedAdapter(),
  ];

  public getSupportedAdapters(): PlatformAdapter[] {
    return [...this.adapters];
  }

  public async syncAll(workspaceRoot: string, skillsDir?: string): Promise<AdapterSyncResult[]> {
    const results: AdapterSyncResult[] = [];
    for (const adapter of this.adapters) {
      const res = await adapter.sync(workspaceRoot, skillsDir);
      results.push(res);
    }
    return results;
  }

  public async syncDetected(workspaceRoot: string, skillsDir?: string): Promise<AdapterSyncResult[]> {
    const results: AdapterSyncResult[] = [];
    for (const adapter of this.adapters) {
      if (adapter.detect(workspaceRoot)) {
        const res = await adapter.sync(workspaceRoot, skillsDir);
        results.push(res);
      }
    }
    return results;
  }
}
