import { McpServer } from '../../mcp/server.js';

export async function runMcpCommand(workspaceRoot: string): Promise<void> {
  const server = new McpServer(workspaceRoot);
  server.startStdio();
}
