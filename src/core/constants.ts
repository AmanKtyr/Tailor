/**
 * Core constants for Tailor.
 */

export const TAILOR_VERSION = '0.1.0';

export const TAILOR_TAGLINE = 'Make the code fit the project.';

export const MEMORY_DIR = '.ai';

export const MEMORY_FILES = [
  'INDEX.md',
  'PROJECT.md',
  'STACK.md',
  'ARCHITECTURE.md',
  'STRUCTURE.md',
  'CONVENTIONS.md',
  'DECISIONS.md',
  'DEPENDENCIES.md',
  'SECURITY.md',
  'SEO.md',
  'UI.md',
  'API.md',
  'DATABASE.md',
  'TESTING.md',
  'TASKS.md',
  'AGENT-CONTRACT.md',
] as const;

export const DEFAULT_CONFIG_FILE = '.tailor.json';

export const DEFAULT_EXCLUDES = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/.cache/**',
  '**/.venv/**',
  '**/venv/**',
  '**/__pycache__/**',
  '**/target/**',
  '**/bin/**',
  '**/obj/**',
];
