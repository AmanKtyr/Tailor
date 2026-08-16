import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { ProjectIndexer } from '../../src/scanner/indexer.js';

describe('Project Detector & Indexer', () => {
  const fixturesRoot = path.join(process.cwd(), 'benchmarks', 'fixtures');

  it('detects Next.js + Tailwind project signals correctly', async () => {
    const indexer = new ProjectIndexer();
    const index = await indexer.scan(path.join(fixturesRoot, 'nextjs-app'));

    expect(index.signals.primaryLanguage).toBe('TypeScript');
    expect(index.signals.frontend?.framework).toBe('Next.js');
    expect(index.signals.frontend?.styling).toContain('Tailwind CSS');
    expect(index.signals.testing?.runners).toContain('Vitest');
  });

  it('detects Django + PostgreSQL project signals correctly', async () => {
    const indexer = new ProjectIndexer();
    const index = await indexer.scan(path.join(fixturesRoot, 'django-app'));

    expect(index.signals.primaryLanguage).toBe('Python');
    expect(index.signals.backend?.framework).toBe('Django');
    expect(index.signals.database?.engine).toBe('PostgreSQL');
  });

  it('detects .NET C# API project signals correctly', async () => {
    const indexer = new ProjectIndexer();
    const index = await indexer.scan(path.join(fixturesRoot, 'dotnet-api'));

    expect(index.signals.primaryLanguage).toBe('C#/.NET');
    expect(index.signals.backend?.framework).toBe('ASP.NET Core');
  });
});
