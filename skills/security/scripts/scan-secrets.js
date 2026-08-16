#!/usr/bin/env node

/**
 * Deterministic Secret & Dangerous Pattern Scanner
 * Usage: node scan-secrets.js
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const rootDir = process.cwd();

const RULES = [
  { id: 'SEC-PRIVATE-KEY', name: 'Private Key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { id: 'SEC-AWS-KEY', name: 'AWS Access Key', pattern: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/ },
  { id: 'SEC-GENERIC-SECRET', name: 'Hardcoded Secret/Token', pattern: /(?:api_key|apikey|secret_key|private_key|auth_token|client_secret)\s*[:=]\s*['"][a-zA-Z0-9_\-+=/]{16,}['"]/i },
  { id: 'SEC-DANGEROUS-EVAL', name: 'eval() Usage', pattern: /\beval\s*\([^)]+\)/ },
  { id: 'SEC-DISABLED-TLS', name: 'Disabled TLS', pattern: /(?:rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]0['"]|verify\s*=\s*False)/ },
];

const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.next', '.cache', 'tests/fixtures', 'benchmarks/fixtures']);

function scan(dir, findings = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return findings;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(rootDir, full).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
        scan(full, findings);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.json', '.yaml', '.yml', '.env'].includes(ext)) {
        try {
          const content = fs.readFileSync(full, 'utf8');
          const lines = content.split(/\r?\n/);
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            for (const rule of RULES) {
              if (rule.pattern.test(line)) {
                findings.push({
                  ruleId: rule.id,
                  ruleName: rule.name,
                  file: rel,
                  line: i + 1,
                  evidence: line.trim().slice(0, 100),
                });
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }
  return findings;
}

const findings = scan(rootDir);
console.log(JSON.stringify({ totalFindings: findings.length, findings }, null, 2));
if (findings.length > 0) {
  process.exitCode = 1;
}
