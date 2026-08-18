import { Command } from 'commander';
import { TAILOR_TAGLINE, TAILOR_VERSION } from '../core/constants.js';
import { runInitCommand } from './commands/init.js';
import { runAnalyzeCommand } from './commands/analyze.js';
import { runMemoryCommand } from './commands/memory.js';
import { runSecurityCommand } from './commands/security.js';
import { runDependenciesCommand } from './commands/dependencies.js';
import { runReviewCommand } from './commands/review.js';
import { runDoctorCommand } from './commands/doctor.js';
import { runSpecCommand } from './commands/spec.js';
import { runConstitutionCommand } from './commands/constitution.js';
import { runMcpCommand } from './commands/mcp.js';
import { runSyncCommand } from './commands/sync.js';

export function createProgram(): Command {
  const program = new Command();

  program
    .name('tailor')
    .description(`Tailor — ${TAILOR_TAGLINE}`)
    .version(TAILOR_VERSION)
    .option('--lang <locale>', 'CLI display language (en, es, zh, ja, de, hi)')
    .option('--intensity <level>', 'Pragmatism intensity level (lite, balanced, ultra, strict)');

  program
    .command('init')
    .description('Initialize Tailor project memory, constitution, agent contracts, and configuration')
    .option('-p, --profile <profile>', 'Project profile (e.g. saas, public-web, api, library, cli)')
    .option('-n, --name <name>', 'Project name')
    .option('-y, --yes', 'Non-interactive mode with default answers')
    .option('--json', 'Output machine-readable JSON')
    .option('-q, --quiet', 'Suppress non-essential output')
    .option('-v, --verbose', 'Show detailed debug logs')
    .action(async (options) => {
      await runInitCommand(process.cwd(), options);
    });

  program
    .command('analyze')
    .description('Deterministically inspect repository signals, technologies, and reusable entities')
    .option('--json', 'Output machine-readable JSON')
    .option('-q, --quiet', 'Suppress non-essential output')
    .option('-v, --verbose', 'Show detailed debug logs')
    .action(async (options) => {
      await runAnalyzeCommand(process.cwd(), options);
    });

  const specCmd = program
    .command('spec')
    .description('Manage Spec-Driven Development (SDD) lifecycle with automated reuse checks');

  specCmd
    .command('init')
    .description('Initialize specs/ directory and generate .ai/CONSTITUTION.md')
    .option('--json', 'Output machine-readable JSON')
    .option('-q, --quiet', 'Suppress non-essential output')
    .action(async (options) => {
      await runSpecCommand(process.cwd(), 'init', undefined, options);
    });

  specCmd
    .command('new <name>')
    .description('Scaffold a new feature specification (specs/<id>-<name>/spec.md)')
    .option('--title <title>', 'Human-readable feature title')
    .option('--overview <overview>', 'Feature overview description')
    .option('--json', 'Output machine-readable JSON')
    .option('-q, --quiet', 'Suppress non-essential output')
    .action(async (name, options) => {
      await runSpecCommand(process.cwd(), 'new', name, options);
    });

  specCmd
    .command('plan <identifier>')
    .description('Generate reuse-first technical plan (plan.md) for a specification')
    .option('--json', 'Output machine-readable JSON')
    .option('-q, --quiet', 'Suppress non-essential output')
    .action(async (identifier, options) => {
      await runSpecCommand(process.cwd(), 'plan', identifier, options);
    });

  specCmd
    .command('tasks <identifier>')
    .description('Generate granular actionable task checklist (tasks.md) for a specification')
    .option('--json', 'Output machine-readable JSON')
    .option('-q, --quiet', 'Suppress non-essential output')
    .action(async (identifier, options) => {
      await runSpecCommand(process.cwd(), 'tasks', identifier, options);
    });

  specCmd
    .command('list')
    .description('List all feature specifications and their lifecycle status')
    .option('--json', 'Output machine-readable JSON')
    .action(async (options) => {
      await runSpecCommand(process.cwd(), 'list', undefined, options);
    });

  program
    .command('constitution')
    .description('View or update project constitution (.ai/CONSTITUTION.md)')
    .option('-u, --update', 'Regenerate constitution based on current config')
    .option('--json', 'Output machine-readable JSON')
    .option('-q, --quiet', 'Suppress non-essential output')
    .action(async (options) => {
      await runConstitutionCommand(process.cwd(), options);
    });

  program
    .command('sync')
    .description('Synchronize all 10+ AI coding agent adapters (Claude, Cursor, Codex, Gemini, Windsurf, Cline, Copilot, etc.)')
    .option('--all', 'Synchronize all supported platforms')
    .option('--json', 'Output machine-readable JSON')
    .option('-q, --quiet', 'Suppress non-essential output')
    .action(async (options) => {
      await runSyncCommand(process.cwd(), options);
    });

  program
    .command('mcp')
    .description('Start Model Context Protocol (MCP) JSON-RPC server over stdio for Claude, Cursor, and Zed')
    .action(async () => {
      await runMcpCommand(process.cwd());
    });

  const memoryCmd = program
    .command('memory')
    .description('Manage AI project memory layer (.ai/ directory)');

  memoryCmd
    .command('update')
    .description('Synchronize and update project memory files based on current repository state')
    .option('--json', 'Output machine-readable JSON')
    .option('-q, --quiet', 'Suppress non-essential output')
    .action(async (options) => {
      await runMemoryCommand(process.cwd(), 'update', options);
    });

  memoryCmd
    .command('validate')
    .description('Validate completeness and integrity of project memory documents')
    .option('--json', 'Output machine-readable JSON')
    .action(async (options) => {
      await runMemoryCommand(process.cwd(), 'validate', options);
    });

  memoryCmd
    .command('drift')
    .description('Detect drift between source code reality and recorded project memory')
    .option('--json', 'Output machine-readable JSON')
    .action(async (options) => {
      await runMemoryCommand(process.cwd(), 'drift', options);
    });

  program
    .command('security')
    .description('Run static security checks and dependency vulnerability scan')
    .option('--strict', 'Fail on medium severity issues')
    .option('--json', 'Output machine-readable JSON')
    .option('-q, --quiet', 'Suppress non-essential output')
    .action(async (options) => {
      await runSecurityCommand(process.cwd(), options);
    });

  program
    .command('dependencies')
    .description('Audit installed dependencies or evaluate proposed new packages')
    .option('-c, --check <package>', 'Evaluate a proposed new package for redundancy and security')
    .option('--json', 'Output machine-readable JSON')
    .action(async (options) => {
      await runDependenciesCommand(process.cwd(), options);
    });

  program
    .command('review')
    .description('Run comprehensive architectural, reuse, security, and quality review')
    .option('--strict', 'Fail on any high severity findings')
    .option('--json', 'Output machine-readable JSON')
    .action(async (options) => {
      await runReviewCommand(process.cwd(), options);
    });

  program
    .command('doctor')
    .description('Diagnose environment, skill files, memory integrity, and configuration')
    .option('--json', 'Output machine-readable JSON')
    .action(async (options) => {
      await runDoctorCommand(process.cwd(), options);
    });

  return program;
}
