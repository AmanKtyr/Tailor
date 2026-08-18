import { TaskComplexity } from '../core/types.js';

export type SpecStatus = 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'VERIFIED' | 'COMPLETED';

export interface UserStory {
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
}

export interface SpecRequirement {
  id: string;
  title: string;
  description: string;
  priority: 'MUST' | 'SHOULD' | 'COULD';
}

export interface FeatureSpec {
  id: string;
  name: string;
  title: string;
  status: SpecStatus;
  createdAt: string;
  updatedAt: string;
  overview: string;
  userStories: UserStory[];
  requirements: SpecRequirement[];
  nonGoals: string[];
  edgeCases: string[];
  securityConsiderations: string[];
}

export interface ReuseAuditItem {
  requestedEntity: string;
  existingMatch?: string;
  matchType: 'COMPONENT' | 'HOOK' | 'UTIL' | 'STDLIB' | 'DEPENDENCY' | 'NONE';
  action: 'REUSE' | 'EXTEND' | 'NEW';
  rationale: string;
}

export interface TechnicalPlan {
  specId: string;
  title: string;
  createdAt: string;
  architectureOverview: string;
  affectedModules: string[];
  reuseAudit: ReuseAuditItem[];
  proposedFiles: {
    action: 'CREATE' | 'MODIFY' | 'DELETE';
    path: string;
    description: string;
  }[];
  dependenciesRequired: string[];
  testingStrategy: {
    unitTests: string[];
    integrationTests: string[];
    manualVerificationSteps: string[];
  };
  risksAndMitigations: {
    risk: string;
    mitigation: string;
  }[];
}

export interface SpecTask {
  id: string;
  specId: string;
  order: number;
  title: string;
  complexity: TaskComplexity;
  targetFiles: string[];
  completed: boolean;
  notes?: string;
}

export interface ProjectConstitution {
  projectName: string;
  version: string;
  lastUpdated: string;
  intensity: 'lite' | 'balanced' | 'ultra' | 'strict';
  nonNegotiablePrinciples: string[];
  architecturalGuardrails: string[];
  securityRules: string[];
  qualityStandards: string[];
  bannedPatterns: string[];
}
