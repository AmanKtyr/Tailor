import * as fs from 'node:fs';
import * as path from 'node:path';
import { logger } from '../../utils/logger.js';
import { parseFrontmatter, validateSkillFrontmatter } from '../../utils/frontmatter.js';
import { syncSkillsToAgentsFolder } from '../../adapters/manager.js';

export interface SkillsCommandOptions {
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export interface SkillSummary {
  name: string;
  description: string;
  valid: boolean;
  syncedToAgents: boolean;
  path: string;
}

export async function runSkillsCommand(
  workspaceRoot: string,
  action: 'list' | 'sync' | 'info',
  skillName?: string,
  options: SkillsCommandOptions = {}
): Promise<void> {
  logger.configure({ quiet: options.quiet, verbose: options.verbose, json: options.json });

  const skillsDir = path.join(workspaceRoot, 'skills');
  const agentsSkillsDir = path.join(workspaceRoot, '.agents', 'skills');

  if (action === 'sync') {
    const written = syncSkillsToAgentsFolder(workspaceRoot);
    if (options.json) {
      logger.rawJson({
        status: 'SUCCESS',
        syncedCount: written.length,
        files: written,
      });
      return;
    }
    logger.success(`Synchronized ${written.length} files to .agents/skills/`);
    return;
  }

  if (action === 'info') {
    if (!skillName) {
      logger.error('Please specify a skill name: tailor skills info <skill-name>');
      process.exitCode = 1;
      return;
    }

    const skillPath = path.join(skillsDir, skillName, 'SKILL.md');
    const agentSkillPath = path.join(agentsSkillsDir, skillName, 'SKILL.md');
    const targetPath = fs.existsSync(skillPath) ? skillPath : fs.existsSync(agentSkillPath) ? agentSkillPath : null;

    if (!targetPath) {
      logger.error(`Skill "${skillName}" not found in skills/ or .agents/skills/`);
      process.exitCode = 1;
      return;
    }

    const content = fs.readFileSync(targetPath, 'utf8');
    const parsed = parseFrontmatter(content);

    if (options.json) {
      logger.rawJson({
        name: parsed.data.name || skillName,
        description: parsed.data.description || '',
        path: targetPath,
        content: parsed.content,
      });
      return;
    }

    logger.banner();
    logger.info(`Skill: ${parsed.data.name || skillName}`);
    logger.info(`Description: ${parsed.data.description || 'No description'}`);
    logger.info(`Path: ${targetPath}`);
    console.log('\n' + content);
    return;
  }

  // Action: list
  if (!fs.existsSync(skillsDir) && !fs.existsSync(agentsSkillsDir)) {
    if (options.json) {
      logger.rawJson({ status: 'EMPTY', skills: [] });
      return;
    }
    logger.warn('No skills/ or .agents/skills/ directory found in current workspace.');
    return;
  }

  const skillMap = new Map<string, SkillSummary>();

  // Discover in skills/
  if (fs.existsSync(skillsDir)) {
    const entries = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
    for (const d of entries) {
      const file = path.join(skillsDir, d.name, 'SKILL.md');
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, 'utf8');
        const validation = validateSkillFrontmatter(raw, file);
        const agentFile = path.join(agentsSkillsDir, d.name, 'SKILL.md');
        skillMap.set(d.name, {
          name: validation.manifest?.name || d.name,
          description: validation.manifest?.description || '',
          valid: validation.valid,
          syncedToAgents: fs.existsSync(agentFile),
          path: file,
        });
      }
    }
  }

  // Discover in .agents/skills/ if not already found
  if (fs.existsSync(agentsSkillsDir)) {
    const entries = fs.readdirSync(agentsSkillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
    for (const d of entries) {
      if (!skillMap.has(d.name)) {
        const file = path.join(agentsSkillsDir, d.name, 'SKILL.md');
        if (fs.existsSync(file)) {
          const raw = fs.readFileSync(file, 'utf8');
          const validation = validateSkillFrontmatter(raw, file);
          skillMap.set(d.name, {
            name: validation.manifest?.name || d.name,
            description: validation.manifest?.description || '',
            valid: validation.valid,
            syncedToAgents: true,
            path: file,
          });
        }
      }
    }
  }

  const skills = Array.from(skillMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  if (options.json) {
    logger.rawJson({
      status: 'SUCCESS',
      count: skills.length,
      skills,
    });
    return;
  }

  logger.banner();
  logger.info(`Tailor Engineering Skills (${skills.length} available):`);
  console.log('');
  for (const s of skills) {
    const syncBadge = s.syncedToAgents ? '✔ synced' : '⚠ not synced';
    console.log(`  • ${s.name.padEnd(25)} [${syncBadge}]`);
    console.log(`    ${s.description}`);
  }
  console.log('');
  logger.info('Use `tailor skills info <name>` to view detailed directives for any skill.');
  logger.info('Use `tailor skills sync` to synchronize all skills into .agents/skills/.');
}
