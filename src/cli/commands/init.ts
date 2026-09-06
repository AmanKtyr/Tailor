import * as path from 'node:path';
import { ProjectIndexer } from '../../scanner/indexer.js';
import { MemoryGenerator } from '../../memory/generator.js';
import { saveTailorConfig } from '../../config/loader.js';
import { DEFAULT_CONFIG } from '../../config/schema.js';
import { logger } from '../../utils/logger.js';
import { ProjectProfile } from '../../core/types.js';

import { AdapterManager } from '../../adapters/manager.js';

export interface InitCommandOptions {
  profile?: string;
  name?: string;
  yes?: boolean;
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export async function runInitCommand(workspaceRoot: string, options: InitCommandOptions): Promise<void> {
  logger.configure({ quiet: options.quiet, verbose: options.verbose, json: options.json });
  logger.banner();
  logger.info(`Initializing Tailor in workspace: ${workspaceRoot}`);

  const indexer = new ProjectIndexer();
  const index = await indexer.scan(workspaceRoot);

  if (options.profile) {
    index.signals.profile = options.profile as ProjectProfile;
  }
  if (options.name) {
    index.signals.name = options.name;
  }

  // Save config
  const config = {
    ...DEFAULT_CONFIG,
    profile: index.signals.profile,
  };
  const configPath = await saveTailorConfig(workspaceRoot, config);
  logger.debug(`Saved config to ${configPath}`);

  // Generate Memory
  const generator = new MemoryGenerator();
  const memoryFiles = generator.generateMemoryFiles(index);
  const written = generator.writeMemoryToDisk(workspaceRoot, memoryFiles, index.signals);

  // Synchronize AI agent adapters & skills (.agents/skills, GEMINI.md, AGENTS.md, etc.)
  const adapterManager = new AdapterManager();
  const detected = await adapterManager.syncDetected(workspaceRoot);
  if (detected.length === 0) {
    const allResults = await adapterManager.syncAll(workspaceRoot);
    written.push(...allResults.flatMap((r) => r.filesWritten));
  } else {
    written.push(...detected.flatMap((r) => r.filesWritten));
  }

  if (options.json) {
    logger.rawJson({
      status: 'SUCCESS',
      workspaceRoot,
      profile: index.signals.profile,
      signals: index.signals,
      writtenFiles: written,
    });
    return;
  }

  logger.success(`Tailor initialized successfully!`);
  logger.info(`Project profile: ${index.signals.profile}`);
  logger.info(`Primary language: ${index.signals.primaryLanguage}`);
  logger.info(`Generated ${written.length} files (.ai/ memory, skills, and agent adapters)`);
}

