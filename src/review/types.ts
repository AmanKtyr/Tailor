import { ReviewFinding } from '../core/types.js';

export interface ReviewReport {
  timestamp: string;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  findings: ReviewFinding[];
  summary: string;
}
