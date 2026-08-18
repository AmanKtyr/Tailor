import { PragmatismIntensity, LadderEvaluationRequest, LadderEvaluationResult } from './types.js';
import { findStdlibReplacement } from './stdlib-catalog.js';

export class DecisionLadder {
  private intensity: PragmatismIntensity;

  constructor(intensity: PragmatismIntensity = 'balanced') {
    this.intensity = intensity;
  }

  public setIntensity(intensity: PragmatismIntensity): void {
    this.intensity = intensity;
  }

  public getIntensity(): PragmatismIntensity {
    return this.intensity;
  }

  public evaluate(request: LadderEvaluationRequest): LadderEvaluationResult {
    const term = request.featureOrFunction.toLowerCase();

    // 1. YAGNI Check (You Aren't Gonna Need It)
    if (this.isYAGNI(term)) {
      return {
        passed: false,
        selectedStep: 1,
        stepName: 'YAGNI (Skip Entirely)',
        suggestedAction: 'SKIP_YAGNI',
        recommendation: 'Reject this feature or abstraction; it is premature complexity.',
        explanation: `In ${this.intensity} mode, speculative abstractions, premature multi-region scaling, or hypothetical helper wrappers are eliminated before writing code.`,
      };
    }

    // 2. Stdlib Replacement Check (if package is proposed)
    if (request.proposedPackage) {
      const stdlibMatch = findStdlibReplacement(request.proposedPackage);
      if (stdlibMatch) {
        return {
          passed: false,
          selectedStep: 3,
          stepName: 'Standard Library / Platform Feature Available',
          suggestedAction: 'USE_STDLIB',
          recommendation: `Use ${stdlibMatch.replacement} instead of installing '${request.proposedPackage}'.`,
          alternativeCode: stdlibMatch.codeSnippet,
          explanation: stdlibMatch.reason,
        };
      }
    }

    // 3. Native Platform / Browser API Check
    const nativeApi = this.checkNativePlatform(term);
    if (nativeApi) {
      return {
        passed: true,
        selectedStep: 4,
        stepName: 'Native Platform Feature',
        suggestedAction: 'USE_NATIVE_API',
        recommendation: `Use native platform capability: ${nativeApi.feature}`,
        alternativeCode: nativeApi.code,
        explanation: nativeApi.explanation,
      };
    }

    // 4. One-Liner / Minimal Expression Check
    const oneLiner = this.checkOneLiner(term);
    if (oneLiner) {
      return {
        passed: true,
        selectedStep: 6,
        stepName: 'One-Liner Solution',
        suggestedAction: 'WRITE_ONE_LINER',
        recommendation: 'Implement inline using standard language expressions.',
        alternativeCode: oneLiner,
        explanation: 'Avoid creating a 50-line custom class when a single inline expression or arrow function solves the requirement.',
      };
    }

    // 5. Minimum Viable Code
    return {
      passed: true,
      selectedStep: 7,
      stepName: 'Minimum Viable Implementation',
      suggestedAction: 'WRITE_MINIMAL_CODE',
      recommendation: 'Write the simplest, clearest code that fulfills the requirement.',
      explanation: 'Follow clean domain boundaries, maintain strict input validation, and verify with targeted tests.',
    };
  }

  private isYAGNI(term: string): boolean {
    if (this.intensity === 'lite') {
      return false;
    }

    const yagniPatterns = [
      'future proof',
      'generic framework',
      'speculative',
      'microservice split',
      'multi tenant distributed cache',
      'abstract factory for single implementation',
      'custom orm',
    ];

    return yagniPatterns.some((pattern) => term.includes(pattern));
  }

  private checkNativePlatform(term: string): { feature: string; code: string; explanation: string } | null {
    if (term.includes('dialog') || term.includes('modal')) {
      return {
        feature: 'HTML <dialog> element',
        code: '<dialog id="myDialog"><h2>Confirmation</h2><form method="dialog"><button>Close</button></form></dialog>',
        explanation: 'HTML5 native <dialog> element provides built-in accessibility, backdrop styling, and focus trapping.',
      };
    }

    if (term.includes('date picker') || term.includes('datepicker')) {
      return {
        feature: 'HTML <input type="date">',
        code: '<input type="date" name="appointment" />',
        explanation: 'Modern browsers provide localized, accessible, native date pickers without external libraries.',
      };
    }

    if (term.includes('uuid') || term.includes('guid') || term.includes('random id')) {
      return {
        feature: 'crypto.randomUUID()',
        code: 'const id = crypto.randomUUID();',
        explanation: 'Web Crypto API and Node.js provide native RFC 4122 UUID v4 generation.',
      };
    }

    return null;
  }

  private checkOneLiner(term: string): string | null {
    if (term.includes('even') || term.includes('odd')) {
      return 'const isEven = (n: number) => n % 2 === 0;';
    }
    if (term.includes('capitalize')) {
      return 'const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);';
    }
    if (term.includes('unique array') || term.includes('deduplicate')) {
      return 'const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr));';
    }
    if (term.includes('sleep') || term.includes('delay')) {
      return 'const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));';
    }
    return null;
  }
}
