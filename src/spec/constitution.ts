import * as fs from 'node:fs';
import * as path from 'node:path';
import { ProjectConstitution } from './types.js';
import { TailorConfig } from '../config/schema.js';

export function createDefaultConstitution(projectName: string, config: TailorConfig): ProjectConstitution {
  const intensity = config.intensity || 'balanced';

  return {
    projectName,
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    intensity,
    nonNegotiablePrinciples: [
      '1. Reuse-First Engineering: Search existing workspace components, utilities, and abstractions before creating new ones.',
      '2. Pragmatic Simplicity: Prefer standard library and native platform APIs over trivial external dependencies.',
      '3. Truthful Verification: Never claim tests passed or security is clear without running deterministic verification commands.',
      '4. Explicit Architecture: Respect architectural decisions recorded in ADRs; do not restructure boundaries unprompted.',
      '5. Spec-Driven Discipline: All non-trivial features must have an explicit specification, reuse audit, and verified task checklist.',
    ],
    architecturalGuardrails: [
      'Maintain clear separation between domain logic, data access, and presentation layers.',
      'Prefer cohesive modular monolith patterns over premature distributed microservices.',
      'Keep dependency graph unidirectional; avoid cyclic imports and tight cross-module coupling.',
    ],
    securityRules: [
      'Never commit hardcoded API keys, JWT secrets, passwords, or private certificates.',
      'Always parameterize database queries; reject raw SQL string concatenation.',
      'Validate and sanitize all untrusted user inputs at trust boundaries.',
    ],
    qualityStandards: [
      'Every pull request / feature must include targeted unit/integration tests.',
      'Keep functions small and focused on a single responsibility.',
      'Maintain zero TypeScript/linter errors on modified files.',
    ],
    bannedPatterns: [
      'Micro-package bloat (e.g. is-odd, left-pad, is-number).',
      'Blindly wrapping native browser/platform APIs with heavy custom abstractions.',
      'Fabricating or bypassing test verification steps.',
    ],
  };
}

export function formatConstitutionMarkdown(constitution: ProjectConstitution): string {
  return `# Project Constitution: ${constitution.projectName}

> **Governing Principles for AI Coding Agents and Software Engineers**  
> *Version:* ${constitution.version} | *Last Updated:* ${constitution.lastUpdated} | *Pragmatism Intensity:* **${constitution.intensity.toUpperCase()}**

---

## 1. Non-Negotiable Core Principles
${constitution.nonNegotiablePrinciples.map((p) => `- ${p}`).join('\n')}

---

## 2. Architectural Guardrails
${constitution.architecturalGuardrails.map((g) => `- ${g}`).join('\n')}

---

## 3. Security & Compliance Invariants
${constitution.securityRules.map((s) => `- ${s}`).join('\n')}

---

## 4. Quality & Verification Standards
${constitution.qualityStandards.map((q) => `- ${q}`).join('\n')}

---

## 5. Explicitly Banned Anti-Patterns
${constitution.bannedPatterns.map((b) => `- ${b}`).join('\n')}

---

*This constitution is enforced by Tailor. All specifications, technical plans, and agent implementations must strictly comply.*
`;
}

export function writeConstitution(workspaceRoot: string, constitution: ProjectConstitution): string {
  const aiDir = path.join(workspaceRoot, '.ai');
  if (!fs.existsSync(aiDir)) {
    fs.mkdirSync(aiDir, { recursive: true });
  }

  const constitutionPath = path.join(aiDir, 'CONSTITUTION.md');
  const markdown = formatConstitutionMarkdown(constitution);
  fs.writeFileSync(constitutionPath, markdown, 'utf8');

  // Also maintain backward-compatible link for .specify/ if needed
  const specifyDir = path.join(workspaceRoot, '.specify', 'memory');
  if (fs.existsSync(specifyDir)) {
    fs.writeFileSync(path.join(specifyDir, 'constitution.md'), markdown, 'utf8');
  }

  return constitutionPath;
}

export function readConstitution(workspaceRoot: string): string | null {
  const constitutionPath = path.join(workspaceRoot, '.ai', 'CONSTITUTION.md');
  if (fs.existsSync(constitutionPath)) {
    return fs.readFileSync(constitutionPath, 'utf8');
  }
  const specifyPath = path.join(workspaceRoot, '.specify', 'memory', 'constitution.md');
  if (fs.existsSync(specifyPath)) {
    return fs.readFileSync(specifyPath, 'utf8');
  }
  return null;
}
