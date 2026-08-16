import { DependencyEvaluation } from './types.js';
import { ProjectIndex } from '../scanner/indexer.js';

const TRIVIAL_PACKAGES: Record<string, string> = {
  'is-odd': 'Native JS modulo operator: `(n % 2 !== 0)`',
  'is-even': 'Native JS modulo operator: `(n % 2 === 0)`',
  'is-number': 'Native JS `typeof x === "number"` or `!isNaN(Number(x))`',
  'left-pad': 'Native JS `String.prototype.padStart()`',
  'clone-deep': 'Native JS `structuredClone(obj)`',
  'deepmerge': 'Native spread operator `{...a, ...b}` or custom recursive utility',
};

const COMMON_REDUNDANCIES: Array<{ proposed: string; existing: string[]; frameworkBuiltIn?: string; reason: string }> = [
  {
    proposed: 'axios',
    existing: ['node-fetch', 'got', 'ky'],
    frameworkBuiltIn: 'Native global `fetch()` API',
    reason: 'Modern Node.js and browsers provide standard `fetch()` natively.',
  },
  {
    proposed: 'moment',
    existing: ['date-fns', 'dayjs', 'luxon'],
    frameworkBuiltIn: 'Native `Intl.DateTimeFormat` or lighter alternatives like `date-fns`',
    reason: '`moment` is in maintenance mode and significantly larger than modern date libraries.',
  },
  {
    proposed: 'uuid',
    existing: ['nanoid', 'cuid'],
    frameworkBuiltIn: 'Native `crypto.randomUUID()`',
    reason: 'Node.js and modern browsers support native `crypto.randomUUID()`.',
  },
  {
    proposed: 'crypto-js',
    existing: ['bcrypt', 'argon2'],
    frameworkBuiltIn: 'Native `node:crypto` or Web Cryptography API',
    reason: 'Native crypto module provides hardware-accelerated, standard cryptographic primitives.',
  },
];

export class DependencyGovernanceEngine {
  public evaluateNewDependency(
    proposedPackage: string,
    index: ProjectIndex
  ): DependencyEvaluation {
    const pkgLower = proposedPackage.toLowerCase().trim();
    const allInstalledDeps: Record<string, string> = {};

    for (const m of index.manifests) {
      Object.assign(allInstalledDeps, m.dependencies, m.devDependencies);
    }

    // 1. Check trivial packages
    if (TRIVIAL_PACKAGES[pkgLower]) {
      return {
        packageName: proposedPackage,
        isRedundant: true,
        redundancyReason: `Trivial micro-package. Prefer ${TRIVIAL_PACKAGES[pkgLower]}`,
        existingAlternatives: [],
        securityStatus: 'UNVERIFIED',
        licenseStatus: 'ALLOWED',
        recommendation: 'REJECT',
        rationale: `Installing "${proposedPackage}" introduces unnecessary dependency bloat and supply-chain surface for a trivial operation that should be solved with native language capabilities.`,
      };
    }

    // 2. Check already installed exact package
    if (allInstalledDeps[pkgLower]) {
      return {
        packageName: proposedPackage,
        version: allInstalledDeps[pkgLower],
        isRedundant: true,
        redundancyReason: `Package "${proposedPackage}" is already installed (${allInstalledDeps[pkgLower]}).`,
        existingAlternatives: [proposedPackage],
        securityStatus: 'CLEAN',
        licenseStatus: 'ALLOWED',
        recommendation: 'APPROVE',
        rationale: `Package is already present in project manifests. Reuse existing version.`,
      };
    }

    // 3. Check known redundant libraries / native alternatives
    for (const item of COMMON_REDUNDANCIES) {
      if (item.proposed === pkgLower) {
        const foundInstalled = item.existing.filter((e) => allInstalledDeps[e]);
        if (foundInstalled.length > 0) {
          return {
            packageName: proposedPackage,
            isRedundant: true,
            redundancyReason: `Project already has equivalent installed package(s): ${foundInstalled.join(', ')}.`,
            existingAlternatives: foundInstalled,
            securityStatus: 'UNVERIFIED',
            licenseStatus: 'ALLOWED',
            recommendation: 'CHALLENGE',
            rationale: `Duplicate library functionality. Project already uses ${foundInstalled.join(', ')}. Reuse existing library rather than adding ${proposedPackage}.`,
          };
        }

        if (item.frameworkBuiltIn) {
          return {
            packageName: proposedPackage,
            isRedundant: true,
            redundancyReason: item.reason,
            existingAlternatives: [item.frameworkBuiltIn],
            securityStatus: 'UNVERIFIED',
            licenseStatus: 'ALLOWED',
            recommendation: 'CHALLENGE',
            rationale: `${item.reason} Consider using ${item.frameworkBuiltIn} before adding an external dependency.`,
          };
        }
      }
    }

    return {
      packageName: proposedPackage,
      isRedundant: false,
      existingAlternatives: [],
      securityStatus: 'CLEAN',
      licenseStatus: 'ALLOWED',
      recommendation: 'APPROVE',
      rationale: `No direct redundancies or trivial replacements detected. Review package maintenance and license before final integration.`,
    };
  }
}
