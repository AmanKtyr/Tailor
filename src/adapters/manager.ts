import * as fs from 'node:fs';
import * as path from 'node:path';
import { AdapterSyncResult, AgentPlatform, PlatformAdapter } from './types.js';

const SHARED_AGENT_INSTRUCTIONS = `# AI Agent Guidance (Powered by Tailor)

This repository uses **Tailor** for project intelligence, Spec-Driven Development, and Reuse-First engineering discipline.

## Core Directives
1. **Constitution & Project Memory First:** Always consult [\`.ai/CONSTITUTION.md\`](.ai/CONSTITUTION.md) and [\`.ai/INDEX.md\`](.ai/INDEX.md) before making non-trivial changes.
2. **Reuse-First Decision Ladder:** Always search existing components, hooks, and utilities before writing new code.
3. **Pragmatic Simplicity:** Prefer standard library and native platform APIs over trivial external dependencies.
4. **Spec-Driven Discipline:** For non-trivial features, follow the specification lifecycle (\`specs/<id>/spec.md\` -> \`plan.md\` -> \`tasks.md\`).
5. **Truthful Verification:** Verify changes with targeted tests; never fabricate test passes.
`;

export class CodexAdapter implements PlatformAdapter {
  public platform: AgentPlatform = 'codex';
  public displayName = 'Codex / ChatGPT';

  public detect(workspaceRoot: string): boolean {
    return fs.existsSync(path.join(workspaceRoot, '.agents')) || fs.existsSync(path.join(workspaceRoot, 'skills'));
  }

  public async sync(workspaceRoot: string, _skillsDir?: string): Promise<AdapterSyncResult> {
    const agentsSkillsDir = path.join(workspaceRoot, '.agents', 'skills');
    const agentsFile = path.join(workspaceRoot, 'AGENTS.md');

    if (!fs.existsSync(agentsSkillsDir)) {
      fs.mkdirSync(agentsSkillsDir, { recursive: true });
    }

    fs.writeFileSync(agentsFile, SHARED_AGENT_INSTRUCTIONS, 'utf8');

    return {
      platform: 'codex',
      targetPath: agentsFile,
      filesWritten: [agentsFile],
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
description: Tailor Reuse-First and Spec-Driven rules
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
    return fs.existsSync(path.join(workspaceRoot, 'GEMINI.md'));
  }

  public async sync(workspaceRoot: string): Promise<AdapterSyncResult> {
    const geminiPath = path.join(workspaceRoot, 'GEMINI.md');
    fs.writeFileSync(geminiPath, SHARED_AGENT_INSTRUCTIONS, 'utf8');
    return {
      platform: 'gemini',
      targetPath: geminiPath,
      filesWritten: [geminiPath],
      status: 'SUCCESS',
      notes: 'GEMINI.md linked to Tailor project memory.',
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
