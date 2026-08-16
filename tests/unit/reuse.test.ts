import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { ProjectIndexer } from '../../src/scanner/indexer.js';
import { CodeCataloger } from '../../src/reuse/cataloger.js';
import { findPotentialDuplicates } from '../../src/reuse/duplicate-finder.js';

describe('Reuse & Code Cataloger', () => {
  it('extracts exported components from workspace files', async () => {
    const fixturePath = path.join(process.cwd(), 'benchmarks', 'fixtures', 'nextjs-app');
    const indexer = new ProjectIndexer();
    const index = await indexer.scan(fixturePath);

    const cataloger = new CodeCataloger();
    const catalog = cataloger.catalogProject(fixturePath, index.files);

    expect(catalog.components.some((c) => c.name === 'Dialog')).toBe(true);
  });

  it('matches semantic synonyms like modal -> Dialog', async () => {
    const fixturePath = path.join(process.cwd(), 'benchmarks', 'fixtures', 'nextjs-app');
    const indexer = new ProjectIndexer();
    const index = await indexer.scan(fixturePath);

    const cataloger = new CodeCataloger();
    const catalog = cataloger.catalogProject(fixturePath, index.files);

    const matches = findPotentialDuplicates('modal', catalog);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].matchedEntity.name).toBe('Dialog');
  });
});
