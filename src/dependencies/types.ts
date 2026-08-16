import { DependencyRecord } from '../core/types.js';

export interface DependencyAuditResult {
  totalDependencies: number;
  vulnerableCount: number;
  warningCount: number;
  records: DependencyRecord[];
  advisories: Array<{
    packageName: string;
    severity: string;
    title: string;
    url?: string;
    recommendation?: string;
  }>;
  auditToolUsed?: string;
  status: 'CLEAN' | 'WARNING' | 'VULNERABLE' | 'SKIPPED';
}

export interface DependencyEvaluation {
  packageName: string;
  version?: string;
  isRedundant: boolean;
  redundancyReason?: string;
  existingAlternatives: string[];
  securityStatus: 'CLEAN' | 'WARNING' | 'VULNERABLE' | 'UNVERIFIED';
  licenseStatus: 'ALLOWED' | 'RESTRICTED' | 'UNKNOWN';
  recommendation: 'APPROVE' | 'CHALLENGE' | 'REJECT';
  rationale: string;
}
