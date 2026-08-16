import { describe, it, expect } from 'vitest';
import { classifyTask } from '../../src/core/classifier.js';

describe('Task Classifier', () => {
  it('classifies trivial typos and renames as TRIVIAL', () => {
    const res = classifyTask({ goal: 'Fix typo in comment' });
    expect(res.complexity).toBe('TRIVIAL');
    expect(res.requiresProposal).toBe(false);
    expect(res.requiresConfirmation).toBe(false);
  });

  it('classifies localized single-component work as SMALL', () => {
    const res = classifyTask({ goal: 'Add a simple badge' });
    expect(res.complexity).toBe('SMALL');
    expect(res.requiresConfirmation).toBe(false);
  });

  it('classifies features and multi-file logic as MEDIUM', () => {
    const res = classifyTask({ goal: 'Create a new checkout feature with form validation' });
    expect(res.complexity).toBe('MEDIUM');
    expect(res.requiresProposal).toBe(true);
  });

  it('classifies architectural changes as LARGE', () => {
    const res = classifyTask({ goal: 'Split monolithic app into microservices' });
    expect(res.complexity).toBe('LARGE');
    expect(res.requiresProposal).toBe(true);
    expect(res.requiresConfirmation).toBe(true);
  });

  it('classifies auth, secrets, and destructive operations as CRITICAL', () => {
    const resAuth = classifyTask({ goal: 'Implement OAuth authentication and token refresh' });
    expect(resAuth.complexity).toBe('CRITICAL');
    expect(resAuth.requiresProposal).toBe(true);
    expect(resAuth.requiresConfirmation).toBe(true);

    const resDrop = classifyTask({ goal: 'Drop database table users', involvesDestructiveOperation: true });
    expect(resDrop.complexity).toBe('CRITICAL');
  });
});
