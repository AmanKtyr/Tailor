/**
 * Core type definitions for Tailor framework.
 */

export type ProjectProfile =
  | 'saas'
  | 'public-web'
  | 'api'
  | 'mobile'
  | 'internal-tool'
  | 'library'
  | 'cli'
  | 'enterprise'
  | 'financial'
  | 'education'
  | 'ecommerce'
  | 'generic';

export type TaskComplexity = 'TRIVIAL' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'CRITICAL';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type DecisionStatus = 'Accepted' | 'Proposed' | 'Rejected' | 'Deprecated' | 'Superseded';

export interface TechnologyExpertise {
  technology: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
}

export interface ArchitectureDecision {
  id: string;
  title: string;
  status: DecisionStatus;
  decision: string;
  context: string;
  why: string;
  alternatives: string[];
  tradeoffs: string[];
  evidence?: string[];
  date: string;
}

export interface SecurityFinding {
  id: string;
  title: string;
  severity: SeverityLevel;
  finding: string;
  evidence: string;
  impact: string;
  exploitCondition?: string;
  recommendation: string;
  falsePositiveConsiderations?: string;
  filePath?: string;
  lineNumber?: number;
}

export interface ReviewFinding {
  id: string;
  category: 'architecture' | 'duplication' | 'abstraction' | 'dependencies' | 'security' | 'performance' | 'style' | 'testing' | 'documentation';
  severity: SeverityLevel;
  location: string;
  problem: string;
  whyItMatters: string;
  recommendedChange: string;
}

export interface DependencyRecord {
  name: string;
  version: string;
  purpose?: string;
  whyExists?: string;
  securityStatus: 'CLEAN' | 'WARNING' | 'VULNERABLE' | 'UNVERIFIED';
  knownAdvisories: string[];
  maintenance: 'ACTIVE' | 'SLOW' | 'ABANDONED' | 'UNKNOWN';
  license: string;
  decision: 'ACCEPTED' | 'REVIEW' | 'REJECTED';
  alternatives?: string[];
}

export interface MachineProjectState {
  name: string;
  type: string;
  profile: ProjectProfile;
  language: string;
  packageManager?: string;
  frontend?: {
    framework?: string;
    ui?: string[];
    routing?: string;
  };
  backend?: {
    framework?: string;
    runtime?: string;
    apiStyle?: string;
  };
  database?: string;
  caching?: string;
  authentication?: string[];
  testing?: string[];
  seo?: boolean;
  securityLevel?: 'standard' | 'high' | 'strict';
  lastScanned?: string;
  summary?: string;
}

export interface SkillManifest {
  name: string;
  description: string;
  path: string;
  body: string;
  metadata?: Record<string, unknown>;
}
