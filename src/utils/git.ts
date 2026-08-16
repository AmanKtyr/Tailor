import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface GitInfo {
  isGitRepo: boolean;
  branch?: string;
  hasUncommittedChanges?: boolean;
  uncommittedFiles?: string[];
  recentCommits?: string[];
  repoRoot?: string;
}

export function inspectGitState(workspaceRoot: string): GitInfo {
  const dotGitPath = path.join(workspaceRoot, '.git');
  if (!fs.existsSync(dotGitPath)) {
    return { isGitRepo: false };
  }

  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: workspaceRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    const statusOutput = execSync('git status --porcelain', {
      cwd: workspaceRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    const uncommittedFiles = statusOutput
      ? statusOutput.split('\n').map((line) => line.trim().slice(3))
      : [];

    let recentCommits: string[] = [];
    try {
      const logOutput = execSync('git log -n 5 --oneline', {
        cwd: workspaceRoot,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();
      recentCommits = logOutput ? logOutput.split('\n') : [];
    } catch {
      recentCommits = [];
    }

    return {
      isGitRepo: true,
      branch,
      hasUncommittedChanges: uncommittedFiles.length > 0,
      uncommittedFiles,
      recentCommits,
      repoRoot: workspaceRoot,
    };
  } catch {
    return {
      isGitRepo: true,
      hasUncommittedChanges: false,
    };
  }
}
