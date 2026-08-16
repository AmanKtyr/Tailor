import { SecurityFinding, SeverityLevel } from '../core/types.js';

export interface SecurityRule {
  id: string;
  title: string;
  severity: SeverityLevel;
  pattern: RegExp;
  fileExtensions?: string[];
  impact: string;
  exploitCondition: string;
  recommendation: string;
  falsePositiveConsiderations: string;
}

export interface SecurityAuditReport {
  summary: {
    totalFindings: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    infoCount: number;
  };
  findings: SecurityFinding[];
  inspectedFileCount: number;
  timestamp: string;
}
