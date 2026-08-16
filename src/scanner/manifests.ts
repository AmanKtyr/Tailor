import * as fs from 'node:fs';
import * as path from 'node:path';

export interface ParsedManifest {
  type: 'node' | 'python' | 'go' | 'rust' | 'php' | 'dotnet' | 'java' | 'docker';
  filePath: string;
  projectName?: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts?: Record<string, string>;
  raw?: unknown;
}

export function parseNodePackageJson(filePath: string): ParsedManifest | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      type: 'node',
      filePath,
      projectName: raw.name,
      dependencies: raw.dependencies || {},
      devDependencies: raw.devDependencies || {},
      scripts: raw.scripts || {},
      raw,
    };
  } catch {
    return null;
  }
}

export function parsePythonRequirements(filePath: string): ParsedManifest | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const dependencies: Record<string, string> = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([a-zA-Z0-9_\-.]+)(?:[=><~^!]+(.*))?$/);
      if (match) {
        dependencies[match[1]] = match[2] || '*';
      }
    }
    return {
      type: 'python',
      filePath,
      dependencies,
      devDependencies: {},
    };
  } catch {
    return null;
  }
}

export function parsePythonPyProject(filePath: string): ParsedManifest | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const dependencies: Record<string, string> = {};
    let inDeps = false;
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('dependencies = [')) {
        inDeps = true;
        continue;
      }
      if (inDeps) {
        if (trimmed.startsWith(']')) {
          inDeps = false;
          continue;
        }
        const clean = trimmed.replace(/["',]/g, '').trim();
        const match = clean.match(/^([a-zA-Z0-9_\-.]+)(?:[=><~^!]+(.*))?$/);
        if (match) {
          dependencies[match[1]] = match[2] || '*';
        }
      }
    }
    return {
      type: 'python',
      filePath,
      dependencies,
      devDependencies: {},
    };
  } catch {
    return null;
  }
}

export function parseGoMod(filePath: string): ParsedManifest | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const dependencies: Record<string, string> = {};
    let inRequire = false;
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('require (')) {
        inRequire = true;
        continue;
      }
      if (inRequire) {
        if (trimmed === ')') {
          inRequire = false;
          continue;
        }
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 2) {
          dependencies[parts[0]] = parts[1];
        }
      } else if (trimmed.startsWith('require ')) {
        const parts = trimmed.slice(8).trim().split(/\s+/);
        if (parts.length >= 2) {
          dependencies[parts[0]] = parts[1];
        }
      }
    }
    return {
      type: 'go',
      filePath,
      dependencies,
      devDependencies: {},
    };
  } catch {
    return null;
  }
}

export function parseCargoToml(filePath: string): ParsedManifest | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const dependencies: Record<string, string> = {};
    let inDeps = false;
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed === '[dependencies]') {
        inDeps = true;
        continue;
      }
      if (inDeps) {
        if (trimmed.startsWith('[')) {
          inDeps = false;
          continue;
        }
        const parts = trimmed.split('=');
        if (parts.length >= 2) {
          dependencies[parts[0].trim()] = parts[1].replace(/["']/g, '').trim();
        }
      }
    }
    return {
      type: 'rust',
      filePath,
      dependencies,
      devDependencies: {},
    };
  } catch {
    return null;
  }
}

export function parseComposerJson(filePath: string): ParsedManifest | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      type: 'php',
      filePath,
      projectName: raw.name,
      dependencies: raw.require || {},
      devDependencies: raw['require-dev'] || {},
      raw,
    };
  } catch {
    return null;
  }
}
