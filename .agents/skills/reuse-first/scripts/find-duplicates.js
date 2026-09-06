#!/usr/bin/env node

/**
 * Deterministic Duplicate & Reusable Entity Finder for Agent Skills
 * Usage: node find-duplicates.js [search_term]
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const query = process.argv[2] ? process.argv[2].toLowerCase() : '';
const rootDir = process.cwd();

const EXCLUDED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.next', '.cache', 'target', 'bin', 'obj'
]);

const ALLOWED_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.php', '.cs']);

function scan(dir, results = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
        scan(path.join(dir, entry.name), results);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTS.has(ext)) {
        results.push(path.join(dir, entry.name));
      }
    }
  }
  return results;
}

const files = scan(rootDir);
const entities = [];

for (const file of files) {
  try {
    const rel = path.relative(rootDir, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      const compMatch = line.match(/export\s+(?:default\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9]+)/);
      if (compMatch) {
        entities.push({ name: compMatch[1], kind: 'Component/Function', file: rel, line: lineNum });
      }

      const fnMatch = line.match(/(?:function|def|func)\s+([a-zA-Z0-9_]+)\s*\(/);
      if (fnMatch && !compMatch) {
        entities.push({ name: fnMatch[1], kind: 'Function', file: rel, line: lineNum });
      }
    }
  } catch {
    // Ignore
  }
}

if (!query) {
  console.log(JSON.stringify({ totalEntities: entities.length, sample: entities.slice(0, 30) }, null, 2));
} else {
  const matches = entities.filter(e => e.name.toLowerCase().includes(query));
  console.log(JSON.stringify({ query, matchCount: matches.length, matches }, null, 2));
}
