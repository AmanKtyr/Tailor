export type PragmatismIntensity = 'lite' | 'balanced' | 'ultra' | 'strict';

export interface DecisionLadderStep {
  step: number;
  name: string;
  question: string;
  actionIfYes: string;
}

export interface LadderEvaluationRequest {
  featureOrFunction: string;
  proposedPackage?: string;
  proposedCode?: string;
  language?: string;
}

export interface LadderEvaluationResult {
  passed: boolean;
  selectedStep: number;
  stepName: string;
  recommendation: string;
  alternativeCode?: string;
  suggestedAction: 'SKIP_YAGNI' | 'REUSE_WORKSPACE' | 'USE_STDLIB' | 'USE_NATIVE_API' | 'USE_INSTALLED_DEP' | 'WRITE_ONE_LINER' | 'WRITE_MINIMAL_CODE';
  explanation: string;
}

export interface StdlibReplacement {
  package: string;
  language: string;
  replacement: string;
  codeSnippet: string;
  category: string;
  reason: string;
}
