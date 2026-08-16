import * as path from 'node:path';
import { findFiles, ScanBudgetOptions } from './file-finder.js';
import {
  parseCargoToml,
  ParsedManifest,
  parseGoMod,
  parseNodePackageJson,
  parsePythonPyProject,
  parsePythonRequirements,
  parseComposerJson,
} from './manifests.js';
import { ProjectDetector } from './detector.js';
import { DiscoveredFile, ProjectSignals } from './types.js';

export interface ProjectIndex {
  workspaceRoot: string;
  files: DiscoveredFile[];
  manifests: ParsedManifest[];
  signals: ProjectSignals;
  timestamp: string;
}

export class ProjectIndexer {
  public async scan(
    workspaceRoot: string,
    options: ScanBudgetOptions = {}
  ): Promise<ProjectIndex> {
    const files = findFiles(workspaceRoot, options);
    const manifests: ParsedManifest[] = [];

    // Parse known manifests if present
    const nodePkg = parseNodePackageJson(path.join(workspaceRoot, 'package.json'));
    if (nodePkg) manifests.push(nodePkg);

    const pyReq = parsePythonRequirements(path.join(workspaceRoot, 'requirements.txt'));
    if (pyReq) manifests.push(pyReq);

    const pyProj = parsePythonPyProject(path.join(workspaceRoot, 'pyproject.toml'));
    if (pyProj) manifests.push(pyProj);

    const goMod = parseGoMod(path.join(workspaceRoot, 'go.mod'));
    if (goMod) manifests.push(goMod);

    const cargoToml = parseCargoToml(path.join(workspaceRoot, 'Cargo.toml'));
    if (cargoToml) manifests.push(cargoToml);

    const composerJson = parseComposerJson(path.join(workspaceRoot, 'composer.json'));
    if (composerJson) manifests.push(composerJson);

    const detector = new ProjectDetector();
    const signals = detector.detect(workspaceRoot, files, manifests);

    return {
      workspaceRoot,
      files,
      manifests,
      signals,
      timestamp: new Date().toISOString(),
    };
  }
}
