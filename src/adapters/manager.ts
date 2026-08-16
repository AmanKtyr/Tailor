import * as fs from 'node:fs';
import * as path from 'node:path';
import { AdapterSyncResult, AgentPlatform, PlatformAdapter } from './types.js';

export class CodexAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'codex';
  public displayName = 'Codex';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.agents')) || fs.existsSync(path.join(workspaceRoot, 'skills'));
  }

  public async sync(workspaceRoot: string, skillsDir: string): Promise<AdapterSyncResult> {
    const agentsSkillsDir = path.join(workspaceRoot, '.agents', 'skills');
    const written: string[] = [];

    if (!fs.existsSync(agentsSkillsDir)) {
      fs.mkdirSync(agentsSkillsDir, { recursive: true });
    }

    return {
      platform: 'codex',
      targetPath: agentsSkillsDir,
      filesWritten: written,
      status: 'SUCCESS',
      notes: 'Codex discovers skills directly via skills/ and .agents/skills/ directories.',
    };
  }
}

export class ClaudeAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'claude';
  public displayName = 'Claude Code';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, 'CLAUDE.md'));
  }

  public async sync(workspaceRoot: string, _skillsDir: string): Promise<AdapterSyncResult> {
    const claudePath = path.join(workspaceRoot, 'CLAUDE.md');
    const content = `# Claude Code Guidance for this Repository

This project uses **Tailor** for project intelligence and engineering discipline.

## Core Directives
1. **Read Project Memory First:** Always consult [\`.ai/INDEX.md\`](.ai/INDEX.md) before making non-trivial edits.
2. **Reuse-First Ladder:** Always search existing components, hooks, and utilities before creating new ones.
3. **Respect Architecture:** Adhere to decisions documented in [\`.ai/DECISIONS.md\`](.ai/DECISIONS.md).
4. **Targeted Testing:** Run appropriate unit/integration tests before finalizing changes.
`;
    fs.writeFileSync(claudePath, content, 'utf8');
    return {
      platform: 'claude',
      targetPath: claudePath,
      filesWritten: [claudePath],
      status: 'SUCCESS',
      notes: 'CLAUDE.md linked to Tailor project memory.',
    };
  }
}

export class CursorAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'cursor';
  public displayName = 'Cursor';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.cursorrules')) || fs.existsSync(path.join(workspaceRoot, '.cursor'));
  }

  public async sync(workspaceRoot: string, _skillsDir: string): Promise<AdapterSyncResult> {
    const cursorPath = path.join(workspaceRoot, '.cursorrules');
    const content = `# Cursor Rules for this Repository (Powered by Tailor)

- Always consult .ai/INDEX.md first.
- Follow the Reuse-First engineering ladder: search existing components and abstractions before implementing new ones.
- Preserve conventions from .ai/CONVENTIONS.md and respect decisions in .ai/DECISIONS.md.
- Evaluate dependency security before adding new libraries.
`;
    fs.writeFileSync(cursorPath, content, 'utf8');
    return {
      platform: 'cursor',
      targetPath: cursorPath,
      filesWritten: [cursorPath],
      status: 'SUCCESS',
      notes: '.cursorrules linked to Tailor project memory.',
    };
  }
}

export class GeminiAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'gemini';
  public displayName = 'Gemini CLI / Antigravity';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, 'GEMINI.md'));
  }

  public async sync(workspaceRoot: string, _skillsDir: string): Promise<AdapterSyncResult> {
    const geminiPath = path.join(workspaceRoot, 'GEMINI.md');
    const content = `# Gemini Instructions (Powered by Tailor)

1. Read \`.ai/INDEX.md\` before implementing features.
2. Reuse existing project components and utilities.
3. Validate security and avoid committing secrets.
`;
    fs.writeFileSync(geminiPath, content, 'utf8');
    return {
      platform: 'gemini',
      targetPath: geminiPath,
      filesWritten: [geminiPath],
      status: 'SUCCESS',
      notes: 'GEMINI.md linked to Tailor project memory.',
    };
  }
}

export class AdapterManager {
  private adapters: PlatformAdapter[] = [
    new CodexAdapter(),
    new ClaudeAdapter(),
    new CursorAdapter(),
    new GeminiAdapter(),
  ];

  public async syncAll(workspaceRoot: string, skillsDir: string): Promise<AdapterSyncResult[]> {
    const results: AdapterSyncResult[] = [];
    for (const adapter of this.adapters) {
      const res = await adapter.sync(workspaceRoot, skillsDir);
      results.push(res);
    }
    return results;
  }
}
