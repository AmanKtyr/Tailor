import { ConfidenceLevel, ProjectProfile } from '../core/types.js';

export interface MemoryMetadata {
  sourceOfTruth: string;
  evidence: string[];
  lastVerified: string;
  confidence: ConfidenceLevel;
  status: 'CONFIRMED' | 'PROPOSED' | 'DEPRECATED';
}

export interface GeneratedMemoryFile {
  fileName: string;
  relativePath: string;
  content: string;
  metadata?: MemoryMetadata;
}

export interface MemoryValidationResult {
  valid: boolean;
  missingFiles: string[];
  corruptedFiles: string[];
  staleFiles: string[];
  warnings: string[];
  errors: string[];
}

export interface DriftDetectionResult {
  hasDrift: boolean;
  driftedAreas: Array<{
    area: string;
    affectedMemoryFile: string;
    evidence: string;
    suggestedAction: string;
  }>;
}
