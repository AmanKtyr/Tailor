import { ProjectIndexer } from '../../scanner/indexer.js';
import { SecurityAuditCoordinator } from '../../security/audit.js';
import { logger } from '../../utils/logger.js';
import { formatSeverity } from '../../utils/format.js';

export interface SecurityCommandOptions {
  strict?: boolean;
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export async function runSecurityCommand(workspaceRoot: string, options: SecurityCommandOptions): Promise<void> {
  logger.configure({ quiet: options.quiet, verbose: options.verbose, json: options.json });
  logger.info(`Running security audit on ${workspaceRoot}...`);

  const indexer = new ProjectIndexer();
  const index = await indexer.scan(workspaceRoot);

  const coordinator = new SecurityAuditCoordinator();
  const audit = await coordinator.runFullAudit(workspaceRoot, index.files);

  if (options.json) {
    logger.rawJson({
      status: audit.passed ? 'PASSED' : 'FAILED',
      summary: audit.staticReport.summary,
      findings: audit.staticReport.findings,
      timestamp: audit.staticReport.timestamp,
    });
    if (!audit.passed) {
      process.exitCode = 1;
    }
    return;
  }

  logger.log(`\nInspected ${audit.staticReport.inspectedFileCount} files.`);
  logger.log(`Summary: ${audit.staticReport.summary.criticalCount} Critical, ${audit.staticReport.summary.highCount} High, ${audit.staticReport.summary.mediumCount} Medium, ${audit.staticReport.summary.lowCount} Low\n`);

  if (audit.staticReport.findings.length === 0) {
    logger.success(`No security issues or secret leaks detected!`);
    return;
  }

  for (const finding of audit.staticReport.findings) {
    logger.log(`${formatSeverity(finding.severity)} [${finding.id}] ${finding.title}`);
    if (finding.filePath) {
      logger.log(`  Location: ${finding.filePath}${finding.lineNumber ? `:${finding.lineNumber}` : ''}`);
    }
    logger.log(`  Evidence: ${finding.evidence}`);
    logger.log(`  Recommendation: ${finding.recommendation}\n`);
  }

  if (!audit.passed) {
    logger.error(`Security audit failed due to Critical or High severity findings.`);
    process.exitCode = 1;
  } else {
    logger.warn(`Security audit completed with non-blocking warnings.`);
  }
}
