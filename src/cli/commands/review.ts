import { ProjectIndexer } from '../../scanner/indexer.js';
import { ReviewEngine } from '../../review/engine.js';
import { logger } from '../../utils/logger.js';
import { formatSeverity } from '../../utils/format.js';

export interface ReviewCommandOptions {
  strict?: boolean;
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export async function runReviewCommand(workspaceRoot: string, options: ReviewCommandOptions): Promise<void> {
  logger.configure({ quiet: options.quiet, verbose: options.verbose, json: options.json });
  logger.info(`Running comprehensive engineering review for: ${workspaceRoot}`);

  const indexer = new ProjectIndexer();
  const index = await indexer.scan(workspaceRoot);

  const reviewEngine = new ReviewEngine();
  const report = await reviewEngine.runReview(index);

  if (options.json) {
    logger.rawJson({
      status: report.criticalCount > 0 ? 'FAILED' : 'SUCCESS',
      report,
    });
    if (report.criticalCount > 0) {
      process.exitCode = 1;
    }
    return;
  }

  logger.log(`\nReview Results: ${report.summary}\n`);

  if (report.findings.length === 0) {
    logger.success(`Repository passed all architecture, reuse, security, and quality gates!`);
    return;
  }

  for (const f of report.findings) {
    logger.log(`${formatSeverity(f.severity)} [${f.category.toUpperCase()}] ${f.problem}`);
    logger.log(`  Location: ${f.location}`);
    logger.log(`  Why: ${f.whyItMatters}`);
    logger.log(`  Fix: ${f.recommendedChange}\n`);
  }

  if (report.criticalCount > 0 || (options.strict && report.highCount > 0)) {
    logger.error(`Review failed blocking quality checks.`);
    process.exitCode = 1;
  }
}
