import * as fs from 'node:fs';
import * as path from 'node:path';
import { ProjectIndex } from '../scanner/indexer.js';
import { DriftDetectionResult } from './types.js';
import { readMachineProjectState } from './project-json.js';

export class DriftDetector {
  public detectDrift(workspaceRoot: string, currentIndex: ProjectIndex): DriftDetectionResult {
    const savedState = readMachineProjectState(workspaceRoot);
    const driftedAreas: DriftDetectionResult['driftedAreas'] = [];

    if (!savedState) {
      return {
        hasDrift: true,
        driftedAreas: [
          {
            area: 'Initial Setup',
            affectedMemoryFile: '.ai/INDEX.md',
            evidence: 'No recorded project.json found in .ai directory.',
            suggestedAction: 'Run `tailor memory update` to initialize project memory.',
          },
        ],
      };
    }

    const { signals } = currentIndex;

    // 1. Language or Package Manager drift
    if (savedState.language && signals.primaryLanguage && savedState.language !== signals.primaryLanguage) {
      driftedAreas.push({
        area: 'Primary Language',
        affectedMemoryFile: '.ai/STACK.md',
        evidence: `Recorded language was "${savedState.language}", but current detected is "${signals.primaryLanguage}".`,
        suggestedAction: 'Update STACK.md and project.json to reflect new language configuration.',
      });
    }

    // 2. Frontend framework drift
    const recordedFe = savedState.frontend?.framework;
    const currentFe = signals.frontend?.framework;
    if (recordedFe !== currentFe) {
      driftedAreas.push({
        area: 'Frontend Framework',
        affectedMemoryFile: '.ai/STACK.md',
        evidence: `Recorded frontend was "${recordedFe || 'None'}", current detected is "${currentFe || 'None'}".`,
        suggestedAction: 'Update STACK.md and UI.md to match the active frontend framework.',
      });
    }

    // 3. Backend framework drift
    const recordedBe = savedState.backend?.framework;
    const currentBe = signals.backend?.framework;
    if (recordedBe !== currentBe) {
      driftedAreas.push({
        area: 'Backend Framework',
        affectedMemoryFile: '.ai/STACK.md',
        evidence: `Recorded backend was "${recordedBe || 'None'}", current detected is "${currentBe || 'None'}".`,
        suggestedAction: 'Update STACK.md, API.md, and ARCHITECTURE.md.',
      });
    }

    // 4. Database engine drift
    const recordedDb = savedState.database;
    const currentDb = signals.database?.engine || signals.database?.orm;
    if (recordedDb !== currentDb && (recordedDb || currentDb)) {
      driftedAreas.push({
        area: 'Database / ORM',
        affectedMemoryFile: '.ai/DATABASE.md',
        evidence: `Recorded database was "${recordedDb || 'None'}", current detected is "${currentDb || 'None'}".`,
        suggestedAction: 'Update DATABASE.md and STACK.md.',
      });
    }

    // 5. Dependency manifest change check (mtime comparison if available)
    const packageJsonPath = path.join(workspaceRoot, 'package.json');
    if (fs.existsSync(packageJsonPath) && savedState.lastScanned) {
      const stat = fs.statSync(packageJsonPath);
      const scanDate = new Date(savedState.lastScanned);
      if (stat.mtime > scanDate) {
        driftedAreas.push({
          area: 'Package Dependencies',
          affectedMemoryFile: '.ai/DEPENDENCIES.md',
          evidence: 'package.json was modified after last memory synchronization.',
          suggestedAction: 'Run `tailor memory update` or `tailor dependencies` to re-sync dependencies.',
        });
      }
    }

    return {
      hasDrift: driftedAreas.length > 0,
      driftedAreas,
    };
  }
}
