import * as readline from 'node:readline';
import { JsonRpcRequest, JsonRpcResponse, McpToolDefinition } from './types.js';
import { loadTailorConfig } from '../config/loader.js';
import { ProjectIndexer } from '../scanner/indexer.js';
import { findFiles } from '../scanner/file-finder.js';
import { CodeCataloger, ReusableEntity } from '../reuse/cataloger.js';
import { SecurityScanner } from '../security/scanner.js';
import { DependencyGovernanceEngine } from '../dependencies/governance.js';
import { SpecManager } from '../spec/manager.js';
import { DecisionLadder } from '../pragmatism/decision-ladder.js';
import { readConstitution } from '../spec/constitution.js';

export const MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'tailor_analyze',
    description: 'Inspect workspace technologies, frameworks, and reusable component catalog.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tailor_reuse_search',
    description: 'Search workspace for existing reusable components, utilities, and hooks before writing code.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Component, utility, or entity keyword to find (e.g. modal, user, date, dialog).',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'tailor_spec_create',
    description: 'Create a new Spec-Driven Development feature specification (spec.md).',
    inputSchema: {
      type: 'object',
      properties: {
        featureName: {
          type: 'string',
          description: 'Name of the feature (e.g. user-auth, payment-checkout).',
        },
        title: {
          type: 'string',
          description: 'Human-readable title.',
        },
        overview: {
          type: 'string',
          description: 'Brief overview of the feature goals.',
        },
      },
      required: ['featureName'],
    },
  },
  {
    name: 'tailor_spec_plan',
    description: 'Generate a reuse-aware technical implementation plan (plan.md) for a feature.',
    inputSchema: {
      type: 'object',
      properties: {
        specIdentifier: {
          type: 'string',
          description: 'Feature spec folder name or ID (e.g. 001, user-auth).',
        },
      },
      required: ['specIdentifier'],
    },
  },
  {
    name: 'tailor_security_scan',
    description: 'Run static security rules to detect hardcoded secrets, SQL injection, and unsafe code.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tailor_dependency_check',
    description: 'Check a proposed package for bloat, redundancy, and license compatibility.',
    inputSchema: {
      type: 'object',
      properties: {
        packageName: {
          type: 'string',
          description: 'Name of the package to evaluate (e.g. is-odd, axios, lodash).',
        },
      },
      required: ['packageName'],
    },
  },
  {
    name: 'tailor_pragmatism_check',
    description: 'Evaluate code or package against the 7-step pragmatism ladder (YAGNI, stdlib, native API).',
    inputSchema: {
      type: 'object',
      properties: {
        term: {
          type: 'string',
          description: 'Feature, abstraction, or helper to evaluate.',
        },
        proposedPackage: {
          type: 'string',
          description: 'Optional package proposed for this task.',
        },
      },
      required: ['term'],
    },
  },
  {
    name: 'tailor_memory_read',
    description: 'Read the project constitution and progressive memory layer (.ai/).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

export class McpServer {
  private workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
  }

  public async handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    const { id, method, params } = request;

    try {
      if (method === 'initialize') {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: {
              name: 'tailor-mcp-server',
              version: '0.2.0',
            },
            capabilities: {
              tools: {},
            },
          },
        };
      }

      if (method === 'tools/list') {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: MCP_TOOLS,
          },
        };
      }

      if (method === 'tools/call') {
        const toolName = params?.name as string;
        const toolArgs = (params?.arguments as Record<string, unknown>) || {};
        const result = await this.executeTool(toolName, toolArgs);
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
              },
            ],
          },
        };
      }

      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: `Internal error: ${msg}`,
        },
      };
    }
  }

  public async executeTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const config = await loadTailorConfig(this.workspaceRoot);

    if (name === 'tailor_analyze') {
      const indexer = new ProjectIndexer();
      const index = await indexer.scan(this.workspaceRoot);
      const cataloger = new CodeCataloger();
      const catalog = cataloger.catalogProject(this.workspaceRoot, index.files);
      return { signals: index.signals, catalog };
    }

    if (name === 'tailor_reuse_search') {
      const query = (args.query as string) || '';
      const files = findFiles(this.workspaceRoot);
      const cataloger = new CodeCataloger();
      const catalog = cataloger.catalogProject(this.workspaceRoot, files);
      const q = query.toLowerCase();

      const matchedComponents = catalog.components.filter(
        (c: ReusableEntity) => c.name.toLowerCase().includes(q) || c.filePath.toLowerCase().includes(q)
      );
      const matchedUtils = catalog.utilities.filter(
        (u: ReusableEntity) => u.name.toLowerCase().includes(q) || u.filePath.toLowerCase().includes(q)
      );

      return {
        query,
        matchedComponents,
        matchedUtils,
        count: matchedComponents.length + matchedUtils.length,
      };
    }

    if (name === 'tailor_spec_create') {
      const specManager = new SpecManager(this.workspaceRoot, config);
      const featureName = args.featureName as string;
      const title = args.title as string | undefined;
      const overview = args.overview as string | undefined;
      return specManager.createSpec(featureName, title, overview);
    }

    if (name === 'tailor_spec_plan') {
      const specManager = new SpecManager(this.workspaceRoot, config);
      const specId = args.specIdentifier as string;
      return await specManager.generatePlan(specId);
    }

    if (name === 'tailor_security_scan') {
      const files = findFiles(this.workspaceRoot);
      const scanner = new SecurityScanner();
      return scanner.scanFiles(this.workspaceRoot, files);
    }

    if (name === 'tailor_dependency_check') {
      const pkg = args.packageName as string;
      const indexer = new ProjectIndexer();
      const index = await indexer.scan(this.workspaceRoot);
      const engine = new DependencyGovernanceEngine();
      return engine.evaluateNewDependency(pkg, index);
    }

    if (name === 'tailor_pragmatism_check') {
      const term = args.term as string;
      const proposedPackage = args.proposedPackage as string | undefined;
      const ladder = new DecisionLadder(config.intensity || 'balanced');
      return ladder.evaluate({ featureOrFunction: term, proposedPackage });
    }

    if (name === 'tailor_memory_read') {
      const constitution = readConstitution(this.workspaceRoot);
      return { constitution };
    }

    throw new Error(`Unknown tool: ${name}`);
  }

  public startStdio(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on('line', async (line) => {
      if (!line.trim()) return;
      try {
        const req: JsonRpcRequest = JSON.parse(line);
        const res = await this.handleRequest(req);
        process.stdout.write(JSON.stringify(res) + '\n');
      } catch (err: unknown) {
        const res: JsonRpcResponse = {
          jsonrpc: '2.0',
          error: {
            code: -32700,
            message: 'Parse error',
          },
        };
        process.stdout.write(JSON.stringify(res) + '\n');
      }
    });
  }
}
