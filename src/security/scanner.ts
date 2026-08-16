import * as fs from 'node:fs';
import { DiscoveredFile } from '../scanner/types.js';
import { BUILTIN_SECURITY_RULES } from './rules.js';
import { SecurityAuditReport, SecurityRule } from './types.js';
import { SecurityFinding } from '../core/types.js';

export class SecurityScanner {
  private customRules: SecurityRule[] = [];

  constructor(customRules: SecurityRule[] = []) {
    this.customRules = customRules;
  }

  public scanFiles(workspaceRoot: string, files: DiscoveredFile[]): SecurityAuditReport {
    const rules = [...BUILTIN_SECURITY_RULES, ...this.customRules];
    const findings: SecurityFinding[] = [];
    let inspectedCount = 0;

    const isDirectFixtureAudit = workspaceRoot.includes('benchmarks/fixtures') || workspaceRoot.includes('benchmarks\\fixtures');

    const codeFiles = files.filter((f) => {
      // Don't scan fixture / test dummy secrets unless explicitly auditing the fixture directory directly
      if (!isDirectFixtureAudit) {
        if (f.relativePath.startsWith('tests/fixtures') || f.relativePath.startsWith('benchmarks/fixtures')) {
          return false;
        }
      }
      return ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.php', '.env', '.json', '.yaml', '.yml'].includes(f.extension);
    });

    for (const file of codeFiles) {
      inspectedCount++;
      try {
        const content = fs.readFileSync(file.absolutePath, 'utf8');
        const lines = content.split(/\r?\n/);

        for (const rule of rules) {
          if (rule.fileExtensions && !rule.fileExtensions.includes(file.extension)) {
            continue;
          }

          for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];
            if (rule.pattern.test(line)) {
              findings.push({
                id: `${rule.id}-${findings.length + 1}`,
                title: rule.title,
                severity: rule.severity,
                finding: `Matched pattern for rule ${rule.id}`,
                evidence: line.trim().slice(0, 140),
                impact: rule.impact,
                exploitCondition: rule.exploitCondition,
                recommendation: rule.recommendation,
                falsePositiveConsiderations: rule.falsePositiveConsiderations,
                filePath: file.relativePath,
                lineNumber: lineIdx + 1,
              });
            }
          }
        }
      } catch {
        // Skip unreadable files safely
      }
    }

    const summary = {
      totalFindings: findings.length,
      criticalCount: findings.filter((f) => f.severity === 'CRITICAL').length,
      highCount: findings.filter((f) => f.severity === 'HIGH').length,
      mediumCount: findings.filter((f) => f.severity === 'MEDIUM').length,
      lowCount: findings.filter((f) => f.severity === 'LOW').length,
      infoCount: findings.filter((f) => f.severity === 'INFO').length,
    };

    return {
      summary,
      findings,
      inspectedFileCount: inspectedCount,
      timestamp: new Date().toISOString(),
    };
  }
}
