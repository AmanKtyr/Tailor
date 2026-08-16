import * as fs from 'node:fs';
import * as path from 'node:path';
import { MEMORY_DIR, MEMORY_FILES } from '../core/constants.js';
import { MemoryValidationResult } from './types.js';

export class MemoryValidator {
  public validateMemory(workspaceRoot: string): MemoryValidationResult {
    const memoryDir = path.join(workspaceRoot, MEMORY_DIR);
    const missingFiles: string[] = [];
    const corruptedFiles: string[] = [];
    const staleFiles: string[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!fs.existsSync(memoryDir)) {
      errors.push(`Memory directory "${MEMORY_DIR}" does not exist.`);
      return {
        valid: false,
        missingFiles: [...MEMORY_FILES],
        corruptedFiles: [],
        staleFiles: [],
        warnings: [],
        errors,
      };
    }

    // Check core required files
    const coreRequired = ['INDEX.md', 'PROJECT.md', 'STACK.md', 'AGENT-CONTRACT.md'];

    for (const requiredFile of coreRequired) {
      const fullPath = path.join(memoryDir, requiredFile);
      if (!fs.existsSync(fullPath)) {
        missingFiles.push(requiredFile);
        errors.push(`Required memory file "${requiredFile}" is missing.`);
      } else {
        try {
          const content = fs.readFileSync(fullPath, 'utf8').trim();
          if (content.length === 0) {
            corruptedFiles.push(requiredFile);
            errors.push(`Memory file "${requiredFile}" is empty.`);
          }
        } catch {
          corruptedFiles.push(requiredFile);
          errors.push(`Failed to read memory file "${requiredFile}".`);
        }
      }
    }

    // Check .ai/project.json
    const jsonPath = path.join(memoryDir, 'project.json');
    if (!fs.existsSync(jsonPath)) {
      missingFiles.push('project.json');
      warnings.push('Machine-readable state ".ai/project.json" is missing.');
    } else {
      try {
        JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } catch {
        corruptedFiles.push('project.json');
        errors.push('Failed to parse ".ai/project.json" as valid JSON.');
      }
    }

    return {
      valid: errors.length === 0,
      missingFiles,
      corruptedFiles,
      staleFiles,
      warnings,
      errors,
    };
  }
}
