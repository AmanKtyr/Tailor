import yaml from 'js-yaml';
import { SkillManifest } from '../core/types.js';

export interface ParsedFrontmatter<T = Record<string, unknown>> {
  data: T;
  content: string;
  hasFrontmatter: boolean;
}

export function parseFrontmatter<T = Record<string, unknown>>(rawContent: string): ParsedFrontmatter<T> {
  const normalized = rawContent.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return {
      data: {} as T,
      content: normalized,
      hasFrontmatter: false,
    };
  }

  try {
    const parsedData = (yaml.load(match[1]) || {}) as T;
    return {
      data: parsedData,
      content: match[2],
      hasFrontmatter: true,
    };
  } catch (err) {
    return {
      data: {} as T,
      content: normalized,
      hasFrontmatter: false,
    };
  }
}

export function stringifyFrontmatter(data: Record<string, unknown>, content: string): string {
  const yamlString = yaml.dump(data, { lineWidth: 1000, noRefs: true }).trim();
  const normalizedContent = content.replace(/\r\n/g, '\n').trim();
  return `---\n${yamlString}\n---\n\n${normalizedContent}\n`;
}

export function validateSkillFrontmatter(rawContent: string, filePath: string): {
  valid: boolean;
  errors: string[];
  manifest?: SkillManifest;
} {
  const errors: string[] = [];
  const parsed = parseFrontmatter<{ name?: string; description?: string }>(rawContent);

  if (!parsed.hasFrontmatter) {
    errors.push(`Missing YAML frontmatter delimiters (---) in ${filePath}`);
    return { valid: false, errors };
  }

  if (!parsed.data.name || typeof parsed.data.name !== 'string' || !parsed.data.name.trim()) {
    errors.push(`Frontmatter in ${filePath} is missing required 'name' field.`);
  } else {
    // Check lowercase hyphenated convention
    const nameRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!nameRegex.test(parsed.data.name)) {
      errors.push(`Skill name "${parsed.data.name}" should be lowercase-hyphenated (e.g. "tailor-core").`);
    }
  }

  if (!parsed.data.description || typeof parsed.data.description !== 'string' || !parsed.data.description.trim()) {
    errors.push(`Frontmatter in ${filePath} is missing required 'description' field.`);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    manifest: {
      name: parsed.data.name!,
      description: parsed.data.description!,
      path: filePath,
      body: parsed.content,
      metadata: parsed.data as Record<string, unknown>,
    },
  };
}
