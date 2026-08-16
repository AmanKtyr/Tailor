import { ProjectIndexer } from '../../scanner/indexer.js';
import { logger } from '../../utils/logger.js';
import { CodeCataloger } from '../../reuse/cataloger.js';

export interface AnalyzeCommandOptions {
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export async function runAnalyzeCommand(workspaceRoot: string, options: AnalyzeCommandOptions): Promise<void> {
  logger.configure({ quiet: options.quiet, verbose: options.verbose, json: options.json });
  logger.info(`Analyzing project at: ${workspaceRoot}`);

  const indexer = new ProjectIndexer();
  const index = await indexer.scan(workspaceRoot);

  const cataloger = new CodeCataloger();
  const catalog = cataloger.catalogProject(workspaceRoot, index.files);

  if (options.json) {
    logger.rawJson({
      status: 'SUCCESS',
      workspaceRoot,
      signals: index.signals,
      fileCount: index.files.length,
      manifests: index.manifests.map((m) => ({ type: m.type, file: m.filePath })),
      catalog: {
        componentsCount: catalog.components.length,
        hooksCount: catalog.hooks.length,
        utilitiesCount: catalog.utilities.length,
        servicesCount: catalog.services.length,
        typesCount: catalog.types.length,
      },
    });
    return;
  }

  logger.success(`Project Analysis Complete:`);
  logger.log(`  Name: ${index.signals.name || 'Unnamed'}`);
  logger.log(`  Profile: ${index.signals.profile}`);
  logger.log(`  Language: ${index.signals.primaryLanguage}`);
  logger.log(`  Frontend: ${index.signals.frontend?.framework || 'None'}`);
  logger.log(`  Backend: ${index.signals.backend?.framework || 'None'}`);
  logger.log(`  Database: ${index.signals.database?.engine || index.signals.database?.orm || 'None'}`);
  logger.log(`  Discovered Files: ${index.files.length}`);
  logger.log(`  Reusable Components: ${catalog.components.length}`);
  logger.log(`  Reusable Hooks: ${catalog.hooks.length}`);
  logger.log(`  Reusable Utilities: ${catalog.utilities.length}`);
  logger.log(`  Reusable Services: ${catalog.services.length}`);
}
