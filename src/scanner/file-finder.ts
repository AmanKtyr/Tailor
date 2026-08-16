import * as fs from 'node:fs';
import * as path from 'node:path';
import { DiscoveredFile } from './types.js';
import { DEFAULT_EXCLUDES } from '../core/constants.js';

export interface ScanBudgetOptions {
  maxFiles?: number;
  maxDepth?: number;
  maxSizeBytes?: number;
  excludes?: string[];
}

const DEFAULT_IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  '.cache',
  '.venv',
  'venv',
  '__pycache__',
  'target',
  'bin',
  'obj',
  '.turbo',
  '.svelte-kit',
  '.output',
  'vendor',
]);

export function findFiles(
  rootDir: string,
  options: ScanBudgetOptions = {}
): DiscoveredFile[] {
  const maxFiles = options.maxFiles ?? 2500;
  const maxDepth = options.maxDepth ?? 8;
  const maxSizeBytes = options.maxSizeBytes ?? 2 * 1024 * 1024; // 2MB max per single file
  const results: DiscoveredFile[] = [];

  function traverse(currentDir: string, depth: number) {
    if (depth > maxDepth || results.length >= maxFiles) {
      return;
    }

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (results.length >= maxFiles) break;

      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        if (DEFAULT_IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) {
          // Allow .ai and .github directory exploration
          if (entry.name !== '.ai' && entry.name !== '.github') {
            continue;
          }
        }
        traverse(fullPath, depth + 1);
      } else if (entry.isFile()) {
        try {
          const stat = fs.statSync(fullPath);
          if (stat.size <= maxSizeBytes) {
            results.push({
              relativePath: relPath,
              absolutePath: fullPath,
              size: stat.size,
              extension: path.extname(entry.name).toLowerCase(),
            });
          }
        } catch {
          // Skip unreadable files safely
        }
      }
    }
  }

  traverse(rootDir, 0);
  return results;
}

export function searchProjectText(
  rootDir: string,
  query: string | RegExp,
  options: { extensions?: string[]; maxMatches?: number } = {}
): Array<{ filePath: string; line: number; content: string }> {
  const files = findFiles(rootDir, { maxFiles: 1000, maxDepth: 6 });
  const matches: Array<{ filePath: string; line: number; content: string }> = [];
  const maxMatches = options.maxMatches ?? 50;
  const allowedExts = options.extensions ? new Set(options.extensions.map(e => e.startsWith('.') ? e : `.${e}`)) : null;

  for (const file of files) {
    if (matches.length >= maxMatches) break;
    if (allowedExts && !allowedExts.has(file.extension)) continue;

    try {
      const content = fs.readFileSync(file.absolutePath, 'utf8');
      const lines = content.split(/\r?\n/);

      for (let i = 0; i < lines.length; i++) {
        if (matches.length >= maxMatches) break;
        const line = lines[i];

        const isMatch = typeof query === 'string'
          ? line.toLowerCase().includes(query.toLowerCase())
          : query.test(line);

        if (isMatch) {
          matches.push({
            filePath: file.relativePath,
            line: i + 1,
            content: line.trim(),
          });
        }
      }
    } catch {
      // Ignore binary or non-utf8 files
    }
  }

  return matches;
}
