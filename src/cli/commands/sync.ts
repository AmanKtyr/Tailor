import { AdapterManager } from '../../adapters/manager.js';
import { logger } from '../../utils/logger.js';
import { getTranslation, detectLocale } from '../../i18n/index.js';
import { loadTailorConfig } from '../../config/loader.js';

export async function runSyncCommand(
  workspaceRoot: string,
  options: { json?: boolean; quiet?: boolean; all?: boolean; lang?: string } = {}
): Promise<void> {
  const config = await loadTailorConfig(workspaceRoot);
  const locale = (options.lang as any) || config.locale || detectLocale();
  const manager = new AdapterManager();

  const results = options.all
    ? await manager.syncAll(workspaceRoot)
    : await manager.syncAll(workspaceRoot);

  if (options.json) {
    logger.rawJson(results);
    return;
  }

  if (!options.quiet) {
    logger.info('AI Coding Agent Adapters Synchronized:');
    for (const r of results) {
      logger.info(`  ✓ ${r.platform.toUpperCase()}: ${r.targetPath}`);
    }
    logger.success(getTranslation('syncSuccess', locale));
  }
}
