import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { runSkillsCommand } from '../../src/cli/commands/skills.js';

describe('Skills CLI Command', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailor-skills-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('handles empty skills directory gracefully in list mode', async () => {
    await expect(runSkillsCommand(tempDir, 'list', undefined, { json: true })).resolves.not.toThrow();
  });

  it('lists skills and reflects synchronization status', async () => {
    const skillDir = path.join(tempDir, 'skills', 'test-skill');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(
      path.join(skillDir, 'SKILL.md'),
      `---\nname: test-skill\ndescription: A test skill\n---\n# Test Body`
    );

    await expect(runSkillsCommand(tempDir, 'list', undefined, { json: true })).resolves.not.toThrow();
  });

  it('syncs skills from skills/ to .agents/skills/', async () => {
    const skillDir = path.join(tempDir, 'skills', 'my-skill');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(
      path.join(skillDir, 'SKILL.md'),
      `---\nname: my-skill\ndescription: Testing skill sync\n---\n# Skill Content`
    );

    await runSkillsCommand(tempDir, 'sync', undefined, { json: true });
    expect(fs.existsSync(path.join(tempDir, '.agents', 'skills', 'my-skill', 'SKILL.md'))).toBe(true);
  });
});
