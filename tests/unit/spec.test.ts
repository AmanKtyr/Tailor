import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { SpecManager } from '../../src/spec/manager.js';
import { createDefaultConstitution, formatConstitutionMarkdown } from '../../src/spec/constitution.js';
import { DEFAULT_CONFIG } from '../../src/config/schema.js';

describe('Spec-Driven Development Engine', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailor-spec-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should initialize spec system and constitution', () => {
    const manager = new SpecManager(tempDir, DEFAULT_CONFIG);
    const res = manager.initSpecSystem('TestProject');

    expect(fs.existsSync(res.constitutionPath)).toBe(true);
    expect(fs.existsSync(res.specsDir)).toBe(true);

    const content = fs.readFileSync(res.constitutionPath, 'utf8');
    expect(content).toContain('Project Constitution: TestProject');
    expect(content).toContain('Reuse-First Engineering');
  });

  it('should create a structured feature specification', () => {
    const manager = new SpecManager(tempDir, DEFAULT_CONFIG);
    const { specDir, specPath, spec } = manager.createSpec('user-auth', 'User Authentication', 'Handles login and signup');

    expect(fs.existsSync(specPath)).toBe(true);
    expect(spec.id).toBe('001');
    expect(spec.name).toBe('user-auth');
    expect(spec.title).toBe('User Authentication');

    const markdown = fs.readFileSync(specPath, 'utf8');
    expect(markdown).toContain('Feature Specification: User Authentication');
    expect(markdown).toContain('User Stories & Scenarios');
  });

  it('should generate technical plan with automated reuse audit', async () => {
    // Create a mock component file to test reuse cataloging
    const srcDir = path.join(tempDir, 'src', 'components');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(srcDir, 'Dialog.tsx'), 'export const Dialog = () => <div>Dialog</div>;', 'utf8');

    const manager = new SpecManager(tempDir, DEFAULT_CONFIG);
    manager.createSpec('modal-alert');

    const { planPath, plan } = await manager.generatePlan('001');

    expect(fs.existsSync(planPath)).toBe(true);
    expect(plan.specId).toBe('001');
    expect(plan.reuseAudit.length).toBeGreaterThan(0);

    const markdown = fs.readFileSync(planPath, 'utf8');
    expect(markdown).toContain('Reuse-First Audit');
  });

  it('should generate granular actionable tasks', () => {
    const manager = new SpecManager(tempDir, DEFAULT_CONFIG);
    manager.createSpec('payment-checkout');

    const { tasksPath, tasks } = manager.generateTasks('001');

    expect(fs.existsSync(tasksPath)).toBe(true);
    expect(tasks.length).toBeGreaterThanOrEqual(3);
    expect(tasks[0].complexity).toBe('TRIVIAL');

    const markdown = fs.readFileSync(tasksPath, 'utf8');
    expect(markdown).toContain('Actionable Tasks');
  });

  it('should list all specifications in workspace', () => {
    const manager = new SpecManager(tempDir, DEFAULT_CONFIG);
    manager.createSpec('feature-a');
    manager.createSpec('feature-b');

    const list = manager.listSpecs();
    expect(list.length).toBe(2);
    expect(list[0].id).toBe('001');
    expect(list[1].id).toBe('002');
  });
});
