import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { ProjectIndexer } from '../../src/scanner/indexer.js';
import { DependencyGovernanceEngine } from '../../src/dependencies/governance.js';

describe('Dependency Governance Engine', () => {
  it('rejects trivial micro-packages with clean rationale', async () => {
    const indexer = new ProjectIndexer();
    const index = await indexer.scan(path.join(process.cwd(), 'benchmarks', 'fixtures', 'nextjs-app'));
    const engine = new DependencyGovernanceEngine();

    const oddEval = engine.evaluateNewDependency('is-odd', index);
    expect(oddEval.recommendation).toBe('REJECT');
    expect(oddEval.isRedundant).toBe(true);
    expect(oddEval.redundancyReason).toContain('modulo');

    const padEval = engine.evaluateNewDependency('left-pad', index);
    expect(padEval.recommendation).toBe('REJECT');
    expect(padEval.redundancyReason).toContain('padStart');
  });

  it('challenges redundant or legacy libraries in modern environments', async () => {
    const indexer = new ProjectIndexer();
    const index = await indexer.scan(path.join(process.cwd(), 'benchmarks', 'fixtures', 'nextjs-app'));
    const engine = new DependencyGovernanceEngine();

    const axiosEval = engine.evaluateNewDependency('axios', index);
    expect(axiosEval.recommendation).toBe('CHALLENGE');
    expect(axiosEval.existingAlternatives).toContain('Native global `fetch()` API');
  });
});
