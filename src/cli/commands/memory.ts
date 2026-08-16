import { ProjectIndexer } from '../../scanner/indexer.js';
import { MemoryGenerator } from '../../memory/generator.js';
import { MemoryValidator } from '../../memory/validator.js';
import { DriftDetector } from '../../memory/drift.js';
import { logger } from '../../utils/logger.js';

export interface MemoryCommandOptions {
  action?: 'update' | 'validate' | 'drift';
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export async function runMemoryCommand(
  workspaceRoot: string,
  action: 'update' | 'validate' | 'drift',
  options: MemoryCommandOptions
): Promise<void> {
  logger.configure({ quiet: options.quiet, verbose: options.verbose, json: options.json });

  const indexer = new ProjectIndexer();
  const index = await indexer.scan(workspaceRoot);

  if (action === 'update') {
    logger.info(`Updating project memory in ${workspaceRoot}...`);
    const generator = new MemoryGenerator();
    const memoryFiles = generator.generateMemoryFiles(index);
    const written = generator.writeMemoryToDisk(workspaceRoot, memoryFiles, index.signals);

    if (options.json) {
      logger.rawJson({ status: 'SUCCESS', action: 'update', writtenFiles: written });
      return;
    }
    logger.success(`Synchronized ${written.length} project memory files under .ai/`);
    return;
  }

  if (action === 'validate') {
    logger.info(`Validating project memory in ${workspaceRoot}...`);
    const validator = new MemoryValidator();
    const result = validator.validateMemory(workspaceRoot);

    if (options.json) {
      logger.rawJson({ status: result.valid ? 'SUCCESS' : 'FAILED', action: 'validate', result });
      return;
    }

    if (result.valid) {
      logger.success(`Project memory is valid and complete!`);
    } else {
      logger.error(`Project memory validation failed:`);
      for (const err of result.errors) {
        logger.error(`  - ${err}`);
      }
      process.exitCode = 1;
    }
    return;
  }

  if (action === 'drift') {
    logger.info(`Checking for project memory drift in ${workspaceRoot}...`);
    const driftDetector = new DriftDetector();
    const drift = driftDetector.detectDrift(workspaceRoot, index);

    if (options.json) {
      logger.rawJson({ status: 'SUCCESS', action: 'drift', drift });
      return;
    }

    if (!drift.hasDrift) {
      logger.success(`No project memory drift detected. Memory is up-to-date with active source code!`);
    } else {
      logger.warn(`Project memory drift detected:`);
      for (const area of drift.driftedAreas) {
        logger.warn(`  [${area.area}] -> ${area.affectedMemoryFile}`);
        logger.log(`    Evidence: ${area.evidence}`);
        logger.log(`    Action: ${area.suggestedAction}`);
      }
    }
    return;
  }
}
