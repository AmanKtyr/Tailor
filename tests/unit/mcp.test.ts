import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { McpServer, MCP_TOOLS } from '../../src/mcp/server.js';
import { JsonRpcRequest } from '../../src/mcp/types.js';

describe('Model Context Protocol (MCP) Server', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailor-mcp-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should handle initialize handshake', async () => {
    const server = new McpServer(tempDir);
    const req: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
    };

    const res = await server.handleRequest(req);
    expect(res.jsonrpc).toBe('2.0');
    expect(res.id).toBe(1);
    expect((res.result as any).serverInfo.name).toBe('tailor-mcp-server');
  });

  it('should list all MCP tools', async () => {
    const server = new McpServer(tempDir);
    const req: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    };

    const res = await server.handleRequest(req);
    const tools = (res.result as any).tools;
    expect(tools.length).toBeGreaterThanOrEqual(7);

    const toolNames = tools.map((t: any) => t.name);
    expect(toolNames).toContain('tailor_analyze');
    expect(toolNames).toContain('tailor_reuse_search');
    expect(toolNames).toContain('tailor_spec_create');
    expect(toolNames).toContain('tailor_spec_plan');
    expect(toolNames).toContain('tailor_security_scan');
    expect(toolNames).toContain('tailor_dependency_check');
  });

  it('should execute tailor_dependency_check tool via MCP', async () => {
    const server = new McpServer(tempDir);
    const req: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'tailor_dependency_check',
        arguments: {
          packageName: 'is-odd',
        },
      },
    };

    const res = await server.handleRequest(req);
    expect(res.id).toBe(3);
    const content = (res.result as any).content[0].text;
    expect(content).toContain('REJECT');
  });

  it('should execute tailor_pragmatism_check tool via MCP', async () => {
    const server = new McpServer(tempDir);
    const req: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'tailor_pragmatism_check',
        arguments: {
          term: 'is-even check',
          proposedPackage: 'is-even',
        },
      },
    };

    const res = await server.handleRequest(req);
    const content = (res.result as any).content[0].text;
    expect(content).toContain('Standard Library');
  });
});
