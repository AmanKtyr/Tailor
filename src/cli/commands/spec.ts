import pc from 'picocolors';
import { loadTailorConfig } from '../../config/loader.js';
import { SpecManager } from '../../spec/manager.js';
import { logger } from '../../utils/logger.js';
import { getTranslation, detectLocale } from '../../i18n/index.js';

export async function runSpecCommand(
  workspaceRoot: string,
  subAction: string,
  targetArg?: string,
  options: { json?: boolean; quiet?: boolean; lang?: string; title?: string; overview?: string } = {}
): Promise<void> {
  const config = await loadTailorConfig(workspaceRoot);
  const locale = (options.lang as any) || config.locale || detectLocale();
  const specManager = new SpecManager(workspaceRoot, config);

  if (subAction === 'init') {
    const projectName = config.profile || 'Tailor-Project';
    const result = specManager.initSpecSystem(projectName);

    if (options.json) {
      logger.rawJson(result);
      return;
    }

    if (!options.quiet) {
      logger.info('Spec-Driven Development Initialized');
      logger.info(`Constitution: ${result.constitutionPath}`);
      logger.info(`Specs Directory: ${result.specsDir}`);
      logger.success(getTranslation('initSuccess', locale));
    }
    return;
  }

  if (subAction === 'new') {
    if (!targetArg) {
      logger.error('Feature name required. Example: tailor spec new user-auth');
      process.exit(1);
    }

    const res = specManager.createSpec(targetArg, options.title, options.overview);

    if (options.json) {
      logger.rawJson(res);
      return;
    }

    if (!options.quiet) {
      logger.info(`Specification Created: ${res.spec.id}-${res.spec.name}`);
      logger.info(`Spec File: ${res.specPath}`);
      logger.info(`Title: ${res.spec.title}`);
      logger.info(`Status: ${res.spec.status}`);
      logger.success(getTranslation('specCreated', locale));
      logger.info(`\nNext step: Run 'tailor spec plan ${res.spec.id}' to generate technical plan with reuse audit.`);
    }
    return;
  }

  if (subAction === 'plan') {
    if (!targetArg) {
      logger.error('Spec ID or folder name required. Example: tailor spec plan 001');
      process.exit(1);
    }

    try {
      const res = await specManager.generatePlan(targetArg);

      if (options.json) {
        logger.rawJson(res);
        return;
      }

      if (!options.quiet) {
        logger.info(`Technical Plan Generated: ${res.plan.specId}`);
        logger.info(`Plan File: ${res.planPath}`);
        logger.info(`Reuse Items Identified: ${res.plan.reuseAudit.length}`);
        logger.info(`Proposed Files: ${res.plan.proposedFiles.length}`);
        logger.success(getTranslation('planGenerated', locale));
        logger.info(`\nNext step: Run 'tailor spec tasks ${res.plan.specId}' to generate execution checklist.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(msg);
      process.exit(1);
    }
    return;
  }

  if (subAction === 'tasks') {
    if (!targetArg) {
      logger.error('Spec ID or folder name required. Example: tailor spec tasks 001');
      process.exit(1);
    }

    try {
      const res = specManager.generateTasks(targetArg);

      if (options.json) {
        logger.rawJson(res);
        return;
      }

      if (!options.quiet) {
        logger.info('Actionable Tasks Generated');
        logger.info(`Tasks File: ${res.tasksPath}`);
        logger.info(`Total Tasks: ${res.tasks.length}`);
        logger.success(getTranslation('tasksGenerated', locale));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(msg);
      process.exit(1);
    }
    return;
  }

  if (subAction === 'list') {
    const specs = specManager.listSpecs();

    if (options.json) {
      logger.rawJson(specs);
      return;
    }

    logger.info(`Specifications in Workspace (${specs.length}):`);
    if (specs.length === 0) {
      logger.info('  No specifications found in specs/ directory. Run "tailor spec new <name>" to create one.');
      return;
    }

    for (const s of specs) {
      const specBadge = s.hasSpec ? pc.green('✓ spec') : pc.red('✗ spec');
      const planBadge = s.hasPlan ? pc.green('✓ plan') : pc.gray('○ plan');
      const tasksBadge = s.hasTasks ? pc.green('✓ tasks') : pc.gray('○ tasks');
      console.log(`  ${pc.bold(s.id)} - ${pc.cyan(s.name)} [${specBadge} | ${planBadge} | ${tasksBadge}]`);
    }
    console.log('');
    return;
  }

  logger.error(`Unknown spec action: ${subAction}. Use init, new, plan, tasks, or list.`);
}
