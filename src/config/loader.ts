import * as fs from 'node:fs';
import * as path from 'node:path';
import { DEFAULT_CONFIG, TailorConfig } from './schema.js';
import { DEFAULT_CONFIG_FILE } from '../core/constants.js';

export async function loadTailorConfig(workspaceRoot: string): Promise<TailorConfig> {
  const candidatePaths = [
    path.join(workspaceRoot, DEFAULT_CONFIG_FILE),
    path.join(workspaceRoot, '.tailor', 'config.json'),
  ];

  for (const configPath of candidatePaths) {
    if (fs.existsSync(configPath)) {
      try {
        const raw = fs.readFileSync(configPath, 'utf8');
        const parsed = JSON.parse(raw) as Partial<TailorConfig>;
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          memory: { ...DEFAULT_CONFIG.memory, ...(parsed.memory || {}) },
          security: { ...DEFAULT_CONFIG.security, ...(parsed.security || {}) },
          seo: { ...DEFAULT_CONFIG.seo, ...(parsed.seo || {}) },
          dependencies: { ...DEFAULT_CONFIG.dependencies, ...(parsed.dependencies || {}) },
          reuse: { ...DEFAULT_CONFIG.reuse, ...(parsed.reuse || {}) },
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[Tailor] Failed to parse config file at ${configPath}: ${msg}. Using defaults.`);
      }
    }
  }

  return { ...DEFAULT_CONFIG };
}

export async function saveTailorConfig(workspaceRoot: string, config: TailorConfig): Promise<string> {
  const configPath = path.join(workspaceRoot, DEFAULT_CONFIG_FILE);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  return configPath;
}
