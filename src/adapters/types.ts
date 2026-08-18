export type AgentPlatform =
  | 'codex'
  | 'claude'
  | 'cursor'
  | 'gemini'
  | 'windsurf'
  | 'cline'
  | 'copilot'
  | 'opencode'
  | 'aider'
  | 'zed'
  | 'generic';

export interface AdapterSyncResult {
  platform: AgentPlatform;
  targetPath: string;
  filesWritten: string[];
  status: 'SUCCESS' | 'SKIPPED' | 'FAILED';
  notes?: string;
}

export interface PlatformAdapter {
  platform: AgentPlatform;
  displayName: string;
  detect(workspaceRoot: string): boolean;
  sync(workspaceRoot: string, skillsDir?: string): Promise<AdapterSyncResult>;
}
