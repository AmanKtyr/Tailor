#!/usr/bin/env node

import { McpServer } from '../mcp/server.js';

const server = new McpServer(process.cwd());
server.startStdio();
