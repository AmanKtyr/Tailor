import { describe, it, expect } from 'vitest';
import { DecisionLadder } from '../../src/pragmatism/decision-ladder.js';
import { findStdlibReplacement } from '../../src/pragmatism/stdlib-catalog.js';

describe('Pragmatism & Anti-Bloat Engine', () => {
  it('should find stdlib replacement for bloated packages', () => {
    const isOdd = findStdlibReplacement('is-odd');
    expect(isOdd).toBeDefined();
    expect(isOdd?.replacement).toContain('Modulo');

    const leftPad = findStdlibReplacement('left-pad');
    expect(leftPad).toBeDefined();
    expect(leftPad?.codeSnippet).toContain('padStart');

    const uuid = findStdlibReplacement('uuid');
    expect(uuid).toBeDefined();
    expect(uuid?.codeSnippet).toContain('crypto.randomUUID()');
  });

  it('should reject YAGNI premature complexity in balanced and ultra modes', () => {
    const ladder = new DecisionLadder('balanced');
    const result = ladder.evaluate({ featureOrFunction: 'speculative multi tenant distributed cache' });

    expect(result.passed).toBe(false);
    expect(result.selectedStep).toBe(1);
    expect(result.suggestedAction).toBe('SKIP_YAGNI');
  });

  it('should recommend stdlib when micro-package is proposed', () => {
    const ladder = new DecisionLadder('balanced');
    const result = ladder.evaluate({
      featureOrFunction: 'number check',
      proposedPackage: 'is-odd',
    });

    expect(result.passed).toBe(false);
    expect(result.selectedStep).toBe(3);
    expect(result.suggestedAction).toBe('USE_STDLIB');
    expect(result.alternativeCode).toBeDefined();
  });

  it('should recommend native platform dialog for modal requests', () => {
    const ladder = new DecisionLadder('balanced');
    const result = ladder.evaluate({ featureOrFunction: 'custom popup modal dialog' });

    expect(result.passed).toBe(true);
    expect(result.selectedStep).toBe(4);
    expect(result.suggestedAction).toBe('USE_NATIVE_API');
    expect(result.alternativeCode).toContain('<dialog');
  });

  it('should provide one-liner for common helper operations', () => {
    const ladder = new DecisionLadder('balanced');
    const result = ladder.evaluate({ featureOrFunction: 'capitalize string' });

    expect(result.passed).toBe(true);
    expect(result.selectedStep).toBe(6);
    expect(result.suggestedAction).toBe('WRITE_ONE_LINER');
    expect(result.alternativeCode).toContain('toUpperCase');
  });
});
