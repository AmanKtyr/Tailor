import { TaskComplexity } from './types.js';

export interface TaskClassificationResult {
  complexity: TaskComplexity;
  rationale: string;
  recommendedWorkflow: string[];
  requiresProposal: boolean;
  requiresConfirmation: boolean;
}

const CRITICAL_KEYWORDS = [
  'auth', 'authentication', 'authorization', 'secret', 'token', 'password',
  'api_key', 'apikey', 'payment', 'stripe', 'billing', 'credit card',
  'drop database', 'delete table', 'rm -rf', 'truncate', 'destroy',
  'crypto', 'private key', 'certificate', 'rbac', 'permission', 'destructive',
  'migration rollback', 'production deploy', 'iam', 'oauth', 'sql injection', 'eval('
];

const LARGE_KEYWORDS = [
  'architecture', 'microservice', 'monolith', 'refactor entire', 'multi-tenant',
  'system migration', 'new service', 'protocol', 'database redesign', 'scale to',
  'split into', 'rewrite entire', 'overhaul', 'event-driven', 'kafka', 'message queue'
];

const MEDIUM_KEYWORDS = [
  'new feature', 'database model', 'create model', 'add model', 'refactor duplicate',
  'component and api', 'crud system', 'service layer', 'hook and component',
  'user profile page', 'form with validation', 'integration', 'state management',
  'router system', 'caching layer'
];

const TRIVIAL_KEYWORDS = [
  'typo', 'rename variable', 'fix comment', 'formatting', 'prettier',
  'eslint fix', 'one line', 'spelling', 'bump version'
];

export function classifyTask(input: {
  goal: string;
  filesAffectedHint?: string[];
  involvesSecurityOrAuth?: boolean;
  involvesDestructiveOperation?: boolean;
}): TaskClassificationResult {
  const goalLower = input.goal.toLowerCase();

  // 1. Critical
  if (
    input.involvesDestructiveOperation ||
    input.involvesSecurityOrAuth ||
    CRITICAL_KEYWORDS.some(k => goalLower.includes(k))
  ) {
    return {
      complexity: 'CRITICAL',
      rationale: 'Task touches security-sensitive areas (auth, secrets, payments, permissions) or potentially destructive operations.',
      recommendedWorkflow: [
        'Read relevant project memory (.ai/SECURITY.md, .ai/ARCHITECTURE.md, .ai/AGENT-CONTRACT.md)',
        'Check existing security/auth patterns & primitives before introducing changes',
        'Draft concise Implementation Proposal with explicit security & risk assessment',
        'Request user confirmation before applying high-risk or destructive changes',
        'Execute targeted tests and security checks (e.g. /security-audit)',
      ],
      requiresProposal: true,
      requiresConfirmation: true,
    };
  }

  // 2. Large
  if (
    (input.filesAffectedHint && input.filesAffectedHint.length > 8) ||
    LARGE_KEYWORDS.some(k => goalLower.includes(k))
  ) {
    return {
      complexity: 'LARGE',
      rationale: 'Task entails substantial architectural changes, large refactoring, or multi-system integration.',
      recommendedWorkflow: [
        'Read .ai/INDEX.md, .ai/ARCHITECTURE.md, .ai/DECISIONS.md',
        'Check for ADR conflicts with current architecture',
        'Draft concise Implementation Proposal with trade-off analysis',
        'Request confirmation before structural upheaval',
        'Verify with full test suite & update project memory upon completion',
      ],
      requiresProposal: true,
      requiresConfirmation: true,
    };
  }

  // 3. Medium
  if (
    (input.filesAffectedHint && input.filesAffectedHint.length > 2) ||
    MEDIUM_KEYWORDS.some(k => goalLower.includes(k))
  ) {
    return {
      complexity: 'MEDIUM',
      rationale: 'Task introduces a standard feature, database model, API endpoint, or multi-file component.',
      recommendedWorkflow: [
        'Read .ai/INDEX.md and relevant domain memory files',
        'Execute Reuse-First Ladder: check existing components/utils/abstractions first',
        'Draft brief implementation outline',
        'Implement adhering to project conventions',
        'Run targeted tests for affected components',
      ],
      requiresProposal: true,
      requiresConfirmation: false,
    };
  }

  // 4. Trivial
  if (TRIVIAL_KEYWORDS.some(k => goalLower.includes(k))) {
    return {
      complexity: 'TRIVIAL',
      rationale: 'Simple localized fix, typo correction, or formatting update. No ceremony needed.',
      recommendedWorkflow: [
        'Apply direct, precise change preserving existing style',
      ],
      requiresProposal: false,
      requiresConfirmation: false,
    };
  }

  // Default to SMALL for localized components, small bugfixes, single endpoints
  return {
    complexity: 'SMALL',
    rationale: 'Localized component, single function, or minor bugfix within existing architecture.',
    recommendedWorkflow: [
      'Search for existing reusable utilities or components',
      'Implement cleanly following conventions in .ai/CONVENTIONS.md',
      'Run relevant unit/component tests',
    ],
    requiresProposal: false,
    requiresConfirmation: false,
  };
}
