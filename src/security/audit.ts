import { DiscoveredFile } from '../scanner/types.js';
import { SecurityScanner } from './scanner.js';
import { DependencyAuditor } from '../dependencies/auditor.js';
import { SecurityAuditReport } from './types.js';
import { SecurityFinding } from '../core/types.js';

export class SecurityAuditCoordinator {
  public async runFullAudit(
    workspaceRoot: string,
    files: DiscoveredFile[]
  ): Promise<{
    staticReport: SecurityAuditReport;
    dependencyFindings: SecurityFinding[];
    passed: boolean;
  }> {
    const scanner = new SecurityScanner();
    const staticReport = scanner.scanFiles(workspaceRoot, files);

    const auditor = new DependencyAuditor();
    const depAudit = await auditor.auditWorkspace(workspaceRoot);

    const dependencyFindings: SecurityFinding[] = depAudit.advisories.map((adv, idx) => ({
      id: `DEP-VULN-${idx + 1}`,
      title: `Vulnerable Dependency: ${adv.packageName}`,
      severity: adv.severity.toUpperCase() === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      finding: adv.title,
      evidence: `Package: ${adv.packageName}, Advisory: ${adv.title}`,
      impact: 'Known vulnerability in third-party supply-chain dependency.',
      recommendation: adv.recommendation || `Update ${adv.packageName} to the latest patched version.`,
      filePath: 'package.json / dependency manifest',
    }));

    const allFindings = [...staticReport.findings, ...dependencyFindings];
    const criticalOrHighCount = allFindings.filter(
      (f) => f.severity === 'CRITICAL' || f.severity === 'HIGH'
    ).length;

    return {
      staticReport: {
        ...staticReport,
        findings: allFindings,
        summary: {
          totalFindings: allFindings.length,
          criticalCount: allFindings.filter((f) => f.severity === 'CRITICAL').length,
          highCount: allFindings.filter((f) => f.severity === 'HIGH').length,
          mediumCount: allFindings.filter((f) => f.severity === 'MEDIUM').length,
          lowCount: allFindings.filter((f) => f.severity === 'LOW').length,
          infoCount: allFindings.filter((f) => f.severity === 'INFO').length,
        },
      },
      dependencyFindings,
      passed: criticalOrHighCount === 0,
    };
  }
}
