import { ProjectIndex } from '../scanner/indexer.js';
import { ReviewReport } from './types.js';
import { ReviewFinding } from '../core/types.js';
import { CodeCataloger } from '../reuse/cataloger.js';
import { SecurityScanner } from '../security/scanner.js';
import { DriftDetector } from '../memory/drift.js';
import { MemoryValidator } from '../memory/validator.js';

export class ReviewEngine {
  public async runReview(index: ProjectIndex): Promise<ReviewReport> {
    const findings: ReviewFinding[] = [];
    const { workspaceRoot, files } = index;

    // 1. Check Project Memory Status
    const validator = new MemoryValidator();
    const valResult = validator.validateMemory(workspaceRoot);
    if (!valResult.valid) {
      for (const err of valResult.errors) {
        findings.push({
          id: `REV-MEM-${findings.length + 1}`,
          category: 'documentation',
          severity: 'HIGH',
          location: '.ai/',
          problem: err,
          whyItMatters: 'Coding agents rely on accurate project memory to preserve conventions and prevent hallucinated architectures.',
          recommendedChange: 'Run `tailor memory update` to initialize and synchronize project memory documents.',
        });
      }
    }

    // 2. Check Drift
    const driftDetector = new DriftDetector();
    const driftResult = driftDetector.detectDrift(workspaceRoot, index);
    if (driftResult.hasDrift) {
      for (const drifted of driftResult.driftedAreas) {
        findings.push({
          id: `REV-DRIFT-${findings.length + 1}`,
          category: 'architecture',
          severity: 'MEDIUM',
          location: drifted.affectedMemoryFile,
          problem: `Memory drift detected in ${drifted.area}: ${drifted.evidence}`,
          whyItMatters: 'Stale project memory leads to misaligned agent actions and duplicate implementations.',
          recommendedChange: drifted.suggestedAction,
        });
      }
    }

    // 3. Check Security Findings
    const secScanner = new SecurityScanner();
    const secReport = secScanner.scanFiles(workspaceRoot, files);
    for (const secFinding of secReport.findings) {
      findings.push({
        id: `REV-SEC-${findings.length + 1}`,
        category: 'security',
        severity: secFinding.severity,
        location: `${secFinding.filePath || 'Unknown'}:${secFinding.lineNumber || 0}`,
        problem: secFinding.title,
        whyItMatters: secFinding.impact,
        recommendedChange: secFinding.recommendation,
      });
    }

    // 4. Check Code Duplication in Catalog
    const cataloger = new CodeCataloger();
    const catalog = cataloger.catalogProject(workspaceRoot, files);

    // Look for duplicate component/utility names
    const componentNames = new Map<string, string[]>();
    for (const comp of catalog.components) {
      const existing = componentNames.get(comp.name) || [];
      existing.push(`${comp.filePath}:${comp.line}`);
      componentNames.set(comp.name, existing);
    }

    for (const [name, locs] of componentNames.entries()) {
      if (locs.length > 1) {
        findings.push({
          id: `REV-DUP-${findings.length + 1}`,
          category: 'duplication',
          severity: 'MEDIUM',
          location: locs.join(', '),
          problem: `Duplicate component "${name}" declared in multiple locations`,
          whyItMatters: 'Duplicate UI components lead to styling fragmentation, inconsistent user experience, and bloated bundles.',
          recommendedChange: `Consolidate "${name}" into a single shared component under src/components/ and reuse across the project.`,
        });
      }
    }

    // 5. Check for missing test configuration if source code exists
    const hasSource = files.some((f) => f.relativePath.startsWith('src/') || f.relativePath.endsWith('.ts') || f.relativePath.endsWith('.py'));
    const hasTests = files.some((f) => f.relativePath.includes('test') || f.relativePath.includes('spec'));
    if (hasSource && !hasTests) {
      findings.push({
        id: `REV-TEST-${findings.length + 1}`,
        category: 'testing',
        severity: 'LOW',
        location: 'tests/',
        problem: 'No automated tests detected in workspace',
        whyItMatters: 'Automated tests ensure agent changes do not introduce regressions into established functionality.',
        recommendedChange: 'Introduce a test framework (e.g. Vitest, Jest, or Pytest) and add unit tests for critical components.',
      });
    }

    const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
    const highCount = findings.filter((f) => f.severity === 'HIGH').length;
    const mediumCount = findings.filter((f) => f.severity === 'MEDIUM').length;
    const lowCount = findings.filter((f) => f.severity === 'LOW').length;
    const infoCount = findings.filter((f) => f.severity === 'INFO').length;

    const summary = findings.length === 0
      ? 'Clean! No architectural, security, or duplication issues detected.'
      : `Found ${findings.length} findings (${criticalCount} Critical, ${highCount} High, ${mediumCount} Medium, ${lowCount} Low, ${infoCount} Info).`;

    return {
      timestamp: new Date().toISOString(),
      totalFindings: findings.length,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      infoCount,
      findings,
      summary,
    };
  }
}
