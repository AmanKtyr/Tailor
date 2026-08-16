import * as fs from 'node:fs';
import * as path from 'node:path';
import { logger } from '../../utils/logger.js';
import { validateSkillFrontmatter } from '../../utils/frontmatter.js';
import { MemoryValidator } from '../../memory/validator.js';
import { inspectGitState } from '../../utils/git.js';

export interface DoctorCommandOptions {
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export interface HealthCheckItem {
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  message: string;
  remediation?: string;
}

export async function runDoctorCommand(workspaceRoot: string, options: DoctorCommandOptions): Promise<void> {
  logger.configure({ quiet: options.quiet, verbose: options.verbose, json: options.json });
  logger.info(`Running Tailor Doctor system & environment diagnostics...`);

  const checks: HealthCheckItem[] = [];

  // 1. Runtime check
  const nodeVersion = process.versions.node;
  const majorVersion = parseInt(nodeVersion.split('.')[0], 10);
  if (majorVersion >= 18) {
    checks.push({
      name: 'Node.js Runtime',
      status: 'PASS',
      message: `Node.js v${nodeVersion} is supported.`,
    });
  } else {
    checks.push({
      name: 'Node.js Runtime',
      status: 'FAIL',
      message: `Node.js v${nodeVersion} is older than required v18+.`,
      remediation: 'Upgrade Node.js to v18, v20, or v22 LTS.',
    });
  }

  // 2. Git check
  const gitInfo = inspectGitState(workspaceRoot);
  if (gitInfo.isGitRepo) {
    checks.push({
      name: 'Git Version Control',
      status: 'PASS',
      message: `Active repository on branch "${gitInfo.branch || 'main'}".`,
    });
  } else {
    checks.push({
      name: 'Git Version Control',
      status: 'WARN',
      message: 'Workspace is not a Git repository.',
      remediation: 'Initialize git with `git init` to enable version tracking.',
    });
  }

  // 3. Project Memory Check
  const memoryValidator = new MemoryValidator();
  const memResult = memoryValidator.validateMemory(workspaceRoot);
  if (memResult.valid) {
    checks.push({
      name: 'Project Memory (.ai/)',
      status: 'PASS',
      message: 'Project memory layer is complete and valid.',
    });
  } else {
    checks.push({
      name: 'Project Memory (.ai/)',
      status: 'WARN',
      message: `Project memory has ${memResult.missingFiles.length} missing files.`,
      remediation: 'Run `tailor memory update` or `tailor init` to build memory.',
    });
  }

  // 4. Skills frontmatter check
  const skillsDir = path.join(workspaceRoot, 'skills');
  if (fs.existsSync(skillsDir)) {
    let allValid = true;
    const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
    for (const d of skillDirs) {
      const skillFile = path.join(skillsDir, d.name, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, 'utf8');
        const validation = validateSkillFrontmatter(content, skillFile);
        if (!validation.valid) {
          allValid = false;
          checks.push({
            name: `Skill: ${d.name}`,
            status: 'FAIL',
            message: `Invalid SKILL.md: ${validation.errors.join(', ')}`,
            remediation: 'Fix YAML frontmatter in SKILL.md with lowercase hyphenated name and description.',
          });
        }
      }
    }
    if (allValid && skillDirs.length > 0) {
      checks.push({
        name: 'Skill Frontmatter',
        status: 'PASS',
        message: `All ${skillDirs.length} skills in skills/ have valid SKILL.md frontmatter.`,
      });
    }
  }

  if (options.json) {
    logger.rawJson({
      status: checks.some((c) => c.status === 'FAIL') ? 'FAIL' : 'PASS',
      checks,
    });
    if (checks.some((c) => c.status === 'FAIL')) process.exitCode = 1;
    return;
  }

  logger.log(`\nDiagnostics Summary:`);
  for (const c of checks) {
    const symbol = c.status === 'PASS' ? '✔' : c.status === 'WARN' ? '⚠' : '✖';
    logger.log(`  ${symbol} [${c.status}] ${c.name}: ${c.message}`);
    if (c.remediation) {
      logger.log(`    → Remediation: ${c.remediation}`);
    }
  }

  if (checks.some((c) => c.status === 'FAIL')) {
    logger.error(`\nDoctor found issues that need attention.`);
    process.exitCode = 1;
  } else {
    logger.success(`\nAll essential doctor diagnostics passed!`);
  }
}
