/**
 * Tailor: AI Coding-Agent Engineering Framework
 */

export * from './core/types.js';
export * from './core/constants.js';
export * from './core/profiles.js';
export * from './core/classifier.js';
export * from './core/errors.js';

export * from './config/schema.js';
export * from './config/loader.js';

export * from './scanner/types.js';
export * from './scanner/file-finder.js';
export * from './scanner/manifests.js';
export * from './scanner/detector.js';
export * from './scanner/indexer.js';

export * from './reuse/cataloger.js';
export * from './reuse/duplicate-finder.js';

export * from './memory/types.js';
export * from './memory/project-json.js';
export * from './memory/generator.js';
export * from './memory/validator.js';
export * from './memory/drift.js';

export * from './dependencies/types.js';
export * from './dependencies/auditor.js';
export * from './dependencies/governance.js';

export * from './security/types.js';
export * from './security/rules.js';
export * from './security/scanner.js';
export * from './security/audit.js';

export * from './review/types.js';
export * from './review/engine.js';

export * from './adapters/types.js';
export * from './adapters/manager.js';

export * from './utils/logger.js';
export * from './utils/frontmatter.js';
export * from './utils/git.js';
export * from './utils/format.js';
