import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { AdapterManager } from '../../src/adapters/manager.js';

describe('Expanded Platform Adapters (10+ AI Platforms)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailor-adapters-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should support 10+ AI coding platforms', () => {
    const manager = new AdapterManager();
    const adapters = manager.getSupportedAdapters();
    expect(adapters.length).toBeGreaterThanOrEqual(10);

    const platformNames = adapters.map((a) => a.platform);
    expect(platformNames).toContain('claude');
    expect(platformNames).toContain('cursor');
    expect(platformNames).toContain('codex');
    expect(platformNames).toContain('gemini');
    expect(platformNames).toContain('windsurf');
    expect(platformNames).toContain('cline');
    expect(platformNames).toContain('copilot');
    expect(platformNames).toContain('opencode');
    expect(platformNames).toContain('aider');
    expect(platformNames).toContain('zed');
  });

  it('should sync all adapter files to workspace', async () => {
    const manager = new AdapterManager();
    const results = await manager.syncAll(tempDir);

    expect(results.length).toBeGreaterThanOrEqual(10);

    // Verify key files were generated
    expect(fs.existsSync(path.join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.cursorrules'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.cursor', 'rules', 'tailor.mdc'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'AGENTS.md'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'GEMINI.md'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.windsurfrules'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.clinerules'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.github', 'copilot-instructions.md'))).toBe(true);
  });
});
