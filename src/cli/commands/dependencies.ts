import { ProjectIndexer } from '../../scanner/indexer.js';
import { DependencyAuditor } from '../../dependencies/auditor.js';
import { DependencyGovernanceEngine } from '../../dependencies/governance.js';
import { logger } from '../../utils/logger.js';
import { formatTable } from '../../utils/format.js';

export interface DependenciesCommandOptions {
  check?: string;
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export async function runDependenciesCommand(
  workspaceRoot: string,
  options: DependenciesCommandOptions
): Promise<void> {
  logger.configure({ quiet: options.quiet, verbose: options.verbose, json: options.json });

  const indexer = new ProjectIndexer();
  const index = await indexer.scan(workspaceRoot);

  if (options.check) {
    logger.info(`Evaluating proposed package: "${options.check}"`);
    const governance = new DependencyGovernanceEngine();
    const evaluation = governance.evaluateNewDependency(options.check, index);

    if (options.json) {
      logger.rawJson({ status: 'SUCCESS', evaluation });
      if (evaluation.recommendation === 'REJECT') {
        process.exitCode = 1;
      }
      return;
    }

    logger.log(`\nPackage Evaluation: ${evaluation.packageName}`);
    logger.log(`Recommendation: ${evaluation.recommendation}`);
    logger.log(`Rationale: ${evaluation.rationale}`);
    if (evaluation.isRedundant) {
      logger.warn(`Redundancy: ${evaluation.redundancyReason}`);
    }
    if (evaluation.existingAlternatives.length > 0) {
      logger.info(`Existing alternatives in project/runtime: ${evaluation.existingAlternatives.join(', ')}`);
    }

    if (evaluation.recommendation === 'REJECT') {
      process.exitCode = 1;
    }
    return;
  }

  logger.info(`Auditing workspace dependencies...`);
  const auditor = new DependencyAuditor();
  const audit = await auditor.auditWorkspace(workspaceRoot);

  if (options.json) {
    logger.rawJson({ status: 'SUCCESS', audit });
    return;
  }

  logger.log(`\nTotal Dependencies: ${audit.totalDependencies}`);
  logger.log(`Tool Used: ${audit.auditToolUsed}`);
  logger.log(`Vulnerabilities Found: ${audit.vulnerableCount}\n`);

  if (audit.records.length > 0) {
    const headers = ['Package', 'Version', 'Security', 'Decision'];
    const rows = audit.records.slice(0, 20).map((r) => [r.name, r.version, r.securityStatus, r.decision]);
    logger.log(formatTable(headers, rows));
    if (audit.records.length > 20) {
      logger.log(`... and ${audit.records.length - 20} more packages.`);
    }
  }

  if (audit.advisories.length > 0) {
    logger.error(`\nSecurity Advisories:`);
    for (const adv of audit.advisories) {
      logger.error(`  - [${adv.severity}] ${adv.packageName}: ${adv.title}`);
    }
    process.exitCode = 1;
  } else {
    logger.success(`No known dependency advisories detected.`);
  }
}
