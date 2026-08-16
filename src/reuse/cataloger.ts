import * as fs from 'node:fs';
import * as path from 'node:path';
import { DiscoveredFile } from '../scanner/types.js';

export interface ReusableEntity {
  name: string;
  kind: 'component' | 'hook' | 'utility' | 'service' | 'model' | 'type' | 'css-class';
  filePath: string;
  line: number;
  description?: string;
}

export interface ProjectComponentCatalog {
  components: ReusableEntity[];
  hooks: ReusableEntity[];
  utilities: ReusableEntity[];
  services: ReusableEntity[];
  types: ReusableEntity[];
}

export class CodeCataloger {
  public catalogProject(
    workspaceRoot: string,
    files: DiscoveredFile[]
  ): ProjectComponentCatalog {
    const catalog: ProjectComponentCatalog = {
      components: [],
      hooks: [],
      utilities: [],
      services: [],
      types: [],
    };

    for (const file of files) {
      if (!['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs'].includes(file.extension)) {
        continue;
      }

      try {
        const content = fs.readFileSync(file.absolutePath, 'utf8');
        const lines = content.split(/\r?\n/);

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lineNum = i + 1;

          // React Component detection: export function Button( / export const Button = ( / export default function Button(
          const compMatch = line.match(/export\s+(?:default\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9]+)/);
          if (compMatch && (file.extension === '.tsx' || file.extension === '.jsx' || file.relativePath.includes('component'))) {
            catalog.components.push({
              name: compMatch[1],
              kind: 'component',
              filePath: file.relativePath,
              line: lineNum,
            });
          }

          // React Hook detection: export function useAuth( / export const useAuth = (
          const hookMatch = line.match(/export\s+(?:default\s+)?(?:function|const)\s+(use[A-Z][a-zA-Z0-9]+)/);
          if (hookMatch) {
            catalog.hooks.push({
              name: hookMatch[1],
              kind: 'hook',
              filePath: file.relativePath,
              line: lineNum,
            });
          }

          // Utility functions: export function formatDate( / export const formatDate =
          const utilMatch = line.match(/export\s+(?:async\s+)?function\s+([a-z][a-zA-Z0-9_]+)/);
          if (utilMatch && !hookMatch) {
            catalog.utilities.push({
              name: utilMatch[1],
              kind: 'utility',
              filePath: file.relativePath,
              line: lineNum,
            });
          }

          // Services / Classes: export class ApiClient / class UserService
          const classMatch = line.match(/export\s+(?:default\s+)?class\s+([A-Z][a-zA-Z0-9]+)/);
          if (classMatch) {
            const isService = classMatch[1].endsWith('Service') || classMatch[1].endsWith('Client') || classMatch[1].endsWith('Repository') || classMatch[1].endsWith('Handler');
            if (isService) {
              catalog.services.push({
                name: classMatch[1],
                kind: 'service',
                filePath: file.relativePath,
                line: lineNum,
              });
            }
          }

          // Types & Interfaces: export interface User / export type UserProfile
          const typeMatch = line.match(/export\s+(?:interface|type)\s+([A-Z][a-zA-Z0-9]+)/);
          if (typeMatch) {
            catalog.types.push({
              name: typeMatch[1],
              kind: 'type',
              filePath: file.relativePath,
              line: lineNum,
            });
          }
        }
      } catch {
        // Skip unreadable files
      }
    }

    return catalog;
  }
}
