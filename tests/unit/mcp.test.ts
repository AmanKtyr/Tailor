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

  it('should execute tailor_skills_list and tailor_skill_get via MCP', async () => {
    const skillDir = path.join(tempDir, 'skills', 'mock-skill');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(
      path.join(skillDir, 'SKILL.md'),
      `---\nname: mock-skill\ndescription: Mock test skill\n---\n# Mock Skill Body`
    );

    const server = new McpServer(tempDir);
    const listReq: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'tailor_skills_list',
        arguments: {},
      },
    };

    const listRes = await server.handleRequest(listReq);
    const listContent = JSON.parse((listRes.result as any).content[0].text);
    expect(listContent.count).toBe(1);
    expect(listContent.skills[0].name).toBe('mock-skill');

    const getReq: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'tailor_skill_get',
        arguments: { skillName: 'mock-skill' },
      },
    };

    const getRes = await server.handleRequest(getReq);
    const getContent = JSON.parse((getRes.result as any).content[0].text);
    expect(getContent.name).toBe('mock-skill');
    expect(getContent.content).toContain('Mock Skill Body');
  });
});
