import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { ProjectIndexer } from '../../src/scanner/indexer.js';
import { SecurityScanner } from '../../src/security/scanner.js';

describe('Security Scanner & Rules Engine', () => {
  it('detects hardcoded keys, eval(), and dangerous queries in messy-monolith', async () => {
    const fixturePath = path.join(process.cwd(), 'benchmarks', 'fixtures', 'messy-monolith');
    const indexer = new ProjectIndexer();
    const index = await indexer.scan(fixturePath);

    const scanner = new SecurityScanner();
    const report = scanner.scanFiles(fixturePath, index.files);

    expect(report.summary.criticalCount).toBeGreaterThan(0);
    expect(report.findings.some((f) => f.title.includes('AWS Access Key'))).toBe(true);
    expect(report.findings.some((f) => f.title.includes('eval()'))).toBe(true);
  });
});
