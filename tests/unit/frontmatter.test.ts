import { describe, it, expect } from 'vitest';
import { parseFrontmatter, validateSkillFrontmatter } from '../../src/utils/frontmatter.js';

describe('Frontmatter Parser & Validator', () => {
  it('parses valid YAML frontmatter', () => {
    const raw = `---
name: sample-skill
description: A sample test skill
---
# Content Body`;

    const parsed = parseFrontmatter(raw);
    expect(parsed.hasFrontmatter).toBe(true);
    expect(parsed.data).toEqual({ name: 'sample-skill', description: 'A sample test skill' });
    expect(parsed.content.trim()).toBe('# Content Body');
  });

  it('validates compliant SKILL.md files', () => {
    const validRaw = `---
name: tailor-core
description: Core Tailor operational skill
---
# Body`;
    const result = validateSkillFrontmatter(validRaw, 'skills/tailor-core/SKILL.md');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.manifest?.name).toBe('tailor-core');
  });

  it('flags invalid skill names that violate lowercase-hyphenated standard', () => {
    const invalidRaw = `---
name: Invalid_Skill_Name!
description: Some description
---
# Body`;
    const result = validateSkillFrontmatter(invalidRaw, 'skills/bad/SKILL.md');
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('lowercase-hyphenated'))).toBe(true);
  });
});
