import { describe, it, expect } from 'vitest';
import { createProgram } from '../../src/cli/cli.js';

describe('CLI Commands Integration', () => {
  it('creates commander program with all subcommands', () => {
    const program = createProgram();
    const commandNames = program.commands.map((c) => c.name());

    expect(commandNames).toContain('init');
    expect(commandNames).toContain('analyze');
    expect(commandNames).toContain('memory');
    expect(commandNames).toContain('security');
    expect(commandNames).toContain('dependencies');
    expect(commandNames).toContain('review');
    expect(commandNames).toContain('doctor');
  });
});
