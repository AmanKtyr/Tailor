import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ProjectIndexer } from '../../src/scanner/indexer.js';
import { MemoryGenerator } from '../../src/memory/generator.js';
import { MemoryValidator } from '../../src/memory/validator.js';
import { DriftDetector } from '../../src/memory/drift.js';

describe('Project Memory Lifecycle & Drift', () => {
  const tmpDir = path.join(process.cwd(), 'scratch', 'test-memory-lifecycle');

  beforeEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    fs.mkdirSync(path.join(tmpDir, 'src'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'temp-app', dependencies: { express: '^4.18.2' } })
    );
    fs.writeFileSync(path.join(tmpDir, 'src', 'index.ts'), 'export const app = true;');
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('generates complete memory, validates integrity, and detects drift', async () => {
    const indexer = new ProjectIndexer();
    const index = await indexer.scan(tmpDir);

    const generator = new MemoryGenerator();
    const memFiles = generator.generateMemoryFiles(index);
    const written = generator.writeMemoryToDisk(tmpDir, memFiles, index.signals);

    expect(written.length).toBeGreaterThan(5);
    expect(fs.existsSync(path.join(tmpDir, '.ai', 'INDEX.md'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, '.ai', 'project.json'))).toBe(true);

    const validator = new MemoryValidator();
    const valResult = validator.validateMemory(tmpDir);
    expect(valResult.valid).toBe(true);
    expect(valResult.missingFiles).toHaveLength(0);

    const driftDetector = new DriftDetector();
    const initialDrift = driftDetector.detectDrift(tmpDir, index);
    expect(initialDrift.hasDrift).toBe(false);
  });
});
