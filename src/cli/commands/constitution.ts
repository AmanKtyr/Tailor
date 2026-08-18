import pc from 'picocolors';
import { loadTailorConfig } from '../../config/loader.js';
import { createDefaultConstitution, writeConstitution, readConstitution } from '../../spec/constitution.js';
import { logger } from '../../utils/logger.js';

export async function runConstitutionCommand(
  workspaceRoot: string,
  options: { json?: boolean; update?: boolean; quiet?: boolean } = {}
): Promise<void> {
  const config = await loadTailorConfig(workspaceRoot);
  const projectName = config.profile || 'Tailor-Project';

  if (options.update) {
    const constitution = createDefaultConstitution(projectName, config);
    const constPath = writeConstitution(workspaceRoot, constitution);

    if (options.json) {
      logger.rawJson(constitution);
      return;
    }

    if (!options.quiet) {
      logger.info('Project Constitution Updated');
      logger.info(`Location: ${constPath}`);
      logger.info(`Intensity: ${(config.intensity || 'balanced').toUpperCase()}`);
      logger.success('Project constitution synchronized with current configuration.');
    }
    return;
  }

  const existing = readConstitution(workspaceRoot);
  if (!existing) {
    const constitution = createDefaultConstitution(projectName, config);
    const constPath = writeConstitution(workspaceRoot, constitution);

    if (options.json) {
      logger.rawJson(constitution);
      return;
    }

    logger.info('Project Constitution Generated');
    logger.info(`Location: ${constPath}`);
    logger.success('Generated default project constitution in .ai/CONSTITUTION.md');
    return;
  }

  if (options.json) {
    logger.rawJson({ constitution: existing });
    return;
  }

  console.log('\n' + existing);
}
