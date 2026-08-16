import { ProjectProfile } from './types.js';

export interface ProfileDefinition {
  name: ProjectProfile;
  title: string;
  description: string;
  seoRelevant: boolean;
  securityStrictness: 'standard' | 'high' | 'strict';
  recommendedMemoryFiles: string[];
  recommendedTestingEmphasis: string[];
}

export const PROFILE_DEFINITIONS: Record<ProjectProfile, ProfileDefinition> = {
  'saas': {
    name: 'saas',
    title: 'Software as a Service (SaaS)',
    description: 'Multi-tenant web application with authentication, subscription/billing, and APIs.',
    seoRelevant: true,
    securityStrictness: 'high',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'ARCHITECTURE.md', 'STRUCTURE.md', 'CONVENTIONS.md', 'DECISIONS.md', 'SECURITY.md', 'UI.md', 'API.md', 'DATABASE.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Unit', 'Integration', 'E2E', 'Auth/RBAC matrix'],
  },
  'public-web': {
    name: 'public-web',
    title: 'Public Web Application / Portal',
    description: 'Consumer-facing web application with heavy emphasis on SEO, accessibility, and performance.',
    seoRelevant: true,
    securityStrictness: 'high',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'STRUCTURE.md', 'CONVENTIONS.md', 'SEO.md', 'UI.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Lighthouse/Core Web Vitals', 'Visual regression', 'SEO validation', 'E2E'],
  },
  'api': {
    name: 'api',
    title: 'Backend API Service',
    description: 'REST, GraphQL, or gRPC backend service with database, caching, and auth.',
    seoRelevant: false,
    securityStrictness: 'strict',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'ARCHITECTURE.md', 'STRUCTURE.md', 'CONVENTIONS.md', 'API.md', 'DATABASE.md', 'SECURITY.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Contract testing', 'Unit', 'Integration', 'Load/Performance'],
  },
  'mobile': {
    name: 'mobile',
    title: 'Mobile Application',
    description: 'Cross-platform or native mobile client application.',
    seoRelevant: false,
    securityStrictness: 'high',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'ARCHITECTURE.md', 'STRUCTURE.md', 'UI.md', 'API.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Device interaction', 'State management', 'Offline sync', 'E2E'],
  },
  'internal-tool': {
    name: 'internal-tool',
    title: 'Internal Tool / Dashboard',
    description: 'Internal operations, admin portal, or employee workflow tool.',
    seoRelevant: false,
    securityStrictness: 'high',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'STRUCTURE.md', 'CONVENTIONS.md', 'UI.md', 'API.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Integration', 'Role-based authorization', 'Data validation'],
  },
  'library': {
    name: 'library',
    title: 'Software Library / Package / SDK',
    description: 'Reusable package, SDK, or utility library with strict public API and semantic versioning requirements.',
    seoRelevant: false,
    securityStrictness: 'strict',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'ARCHITECTURE.md', 'CONVENTIONS.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Unit test coverage > 90%', 'Type checking', 'Backwards compatibility', 'Build bundle size'],
  },
  'cli': {
    name: 'cli',
    title: 'Command Line Tool',
    description: 'Terminal application or developer CLI tool.',
    seoRelevant: false,
    securityStrictness: 'high',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'STRUCTURE.md', 'CONVENTIONS.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['CLI argument parsing', 'Cross-platform execution', 'Process exit codes'],
  },
  'enterprise': {
    name: 'enterprise',
    title: 'Enterprise Software',
    description: 'Large-scale enterprise system with compliance, auditing, SSO, and strict architecture boundaries.',
    seoRelevant: false,
    securityStrictness: 'strict',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'ARCHITECTURE.md', 'STRUCTURE.md', 'CONVENTIONS.md', 'DECISIONS.md', 'SECURITY.md', 'API.md', 'DATABASE.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Compliance checks', 'Security audits', 'Integration', 'Failover testing'],
  },
  'financial': {
    name: 'financial',
    title: 'Financial / Fintech Application',
    description: 'High-security financial processing, payment gateway integration, or transaction ledger.',
    seoRelevant: false,
    securityStrictness: 'strict',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'ARCHITECTURE.md', 'DECISIONS.md', 'SECURITY.md', 'DATABASE.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Idempotency tests', 'Transaction rollback', 'Cryptographic validation', 'Audit logging'],
  },
  'education': {
    name: 'education',
    title: 'Educational Platform / LMS',
    description: 'Learning management system, courseware, or student/school portal.',
    seoRelevant: true,
    securityStrictness: 'high',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'STRUCTURE.md', 'CONVENTIONS.md', 'UI.md', 'DATABASE.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Accessibility (WCAG)', 'Role separation (student/teacher)', 'Integration'],
  },
  'ecommerce': {
    name: 'ecommerce',
    title: 'E-commerce Platform',
    description: 'Online store, catalog, cart, checkout, inventory, and payment integration.',
    seoRelevant: true,
    securityStrictness: 'strict',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'ARCHITECTURE.md', 'STRUCTURE.md', 'SEO.md', 'UI.md', 'SECURITY.md', 'DATABASE.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Payment flow', 'Inventory concurrency', 'SEO structured data', 'Performance under load'],
  },
  'generic': {
    name: 'generic',
    title: 'General Software Project',
    description: 'Standard software project with balanced engineering constraints.',
    seoRelevant: false,
    securityStrictness: 'standard',
    recommendedMemoryFiles: ['INDEX.md', 'PROJECT.md', 'STACK.md', 'STRUCTURE.md', 'CONVENTIONS.md', 'TESTING.md', 'AGENT-CONTRACT.md'],
    recommendedTestingEmphasis: ['Unit', 'Integration'],
  },
};

export function getProfileDefinition(profile?: string): ProfileDefinition {
  if (profile && profile in PROFILE_DEFINITIONS) {
    return PROFILE_DEFINITIONS[profile as ProjectProfile];
  }
  return PROFILE_DEFINITIONS['generic'];
}
