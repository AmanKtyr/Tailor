#!/usr/bin/env node

import { createProgram } from './cli.js';

const program = createProgram();
program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`\n[Tailor Error] ${msg}\n`);
  process.exit(1);
});
