import { Command } from 'commander';
import { TAILOR_TAGLINE, TAILOR_VERSION } from '../core/constants.js';
import { runInitCommand } from './commands/init.js';
import { runAnalyzeCommand } from './commands/analyze.js';
import { runMemoryCommand } from './commands/memory.js';
import { runSecurityCommand } from './commands/security.js';
import { runDependenciesCommand } from './commands/dependencies.js';
import { runReviewCommand } from './commands/review.js';
import { runDoctorCommand } from './commands/doctor.js';

export function createProgram(): Command {
  const program = new Command();

  program
    .name('tailor')
    .description(`Tailor — ${TAILOR_TAGLINE}`)
    .version(TAILOR_VERSION);

  program
    .command('init')
    .description('Initialize Tailor project memory, agent contracts, and configuration')
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
