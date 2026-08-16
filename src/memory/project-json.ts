import * as fs from 'node:fs';
import * as path from 'node:path';
import { MachineProjectState } from '../core/types.js';
import { ProjectSignals } from '../scanner/types.js';
import { MEMORY_DIR } from '../core/constants.js';

export function createMachineProjectState(signals: ProjectSignals): MachineProjectState {
  return {
    name: signals.name || 'Unnamed Project',
    type: signals.profile,
    profile: signals.profile,
    language: signals.primaryLanguage,
    packageManager: signals.packageManager,
    frontend: signals.frontend ? {
      framework: signals.frontend.framework,
      ui: signals.frontend.uiLibraries,
      routing: signals.frontend.routing,
    } : undefined,
    backend: signals.backend ? {
      framework: signals.backend.framework,
      runtime: signals.backend.runtime,
      apiStyle: signals.backend.apiStyle,
    } : undefined,
    database: signals.database?.engine || signals.database?.orm,
    caching: signals.caching?.[0],
    authentication: signals.security?.authSolutions,
    testing: signals.testing ? [...(signals.testing.runners || []), ...(signals.testing.e2e || [])] : undefined,
    seo: signals.seo?.hasMetaTags || signals.seo?.hasSitemap,
    securityLevel: 'high',
    lastScanned: new Date().toISOString(),
    summary: signals.summary,
  };
}

export function readMachineProjectState(workspaceRoot: string): MachineProjectState | null {
  const jsonPath = path.join(workspaceRoot, MEMORY_DIR, 'project.json');
  if (!fs.existsSync(jsonPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as MachineProjectState;
  } catch {
    return null;
  }
}

export function writeMachineProjectState(workspaceRoot: string, state: MachineProjectState): string {
  const memoryDir = path.join(workspaceRoot, MEMORY_DIR);
  if (!fs.existsSync(memoryDir)) {
    fs.mkdirSync(memoryDir, { recursive: true });
  }
  const jsonPath = path.join(memoryDir, 'project.json');
  fs.writeFileSync(jsonPath, JSON.stringify(state, null, 2), 'utf8');
  return jsonPath;
}
