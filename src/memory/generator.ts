import * as fs from 'node:fs';
import * as path from 'node:path';
import { ProjectIndex } from '../scanner/indexer.js';
import { ProjectSignals } from '../scanner/types.js';
import { GeneratedMemoryFile } from './types.js';
import { MEMORY_DIR } from '../core/constants.js';
import { createMachineProjectState, writeMachineProjectState } from './project-json.js';

export class MemoryGenerator {
  public generateMemoryFiles(index: ProjectIndex): GeneratedMemoryFile[] {
    const { signals, files, manifests, workspaceRoot } = index;
    const now = new Date().toISOString().split('T')[0];
    const projectName = signals.name || path.basename(workspaceRoot);

    const generated: GeneratedMemoryFile[] = [];

    // 1. INDEX.md (Crucial entrypoint for AI agent progressive disclosure)
    const indexContent = `# AI Project Index

**Project:** ${projectName}  
**Type:** ${signals.profile}  
**Primary Language:** ${signals.primaryLanguage}  
**Last Verified:** ${now}  

## Read First
1. [\`PROJECT.md\`](PROJECT.md) — High-level product overview and objectives.
2. [\`STACK.md\`](STACK.md) — Verified technology stack and dependencies.
3. [\`CONVENTIONS.md\`](CONVENTIONS.md) — Coding conventions, formatting, and patterns.
4. [\`AGENT-CONTRACT.md\`](AGENT-CONTRACT.md) — Operational contract for coding agents.

## Relevant Domain Memory Files
- Architecture & Decisions: [\`ARCHITECTURE.md\`](ARCHITECTURE.md), [\`DECISIONS.md\`](DECISIONS.md)
- Code Organization: [\`STRUCTURE.md\`](STRUCTURE.md)
- UI & Styling: [\`UI.md\`](UI.md)
- Backend & Endpoints: [\`API.md\`](API.md), [\`DATABASE.md\`](DATABASE.md)
- Security & Compliance: [\`SECURITY.md\`](SECURITY.md), [\`DEPENDENCIES.md\`](DEPENDENCIES.md)
- Quality & Testing: [\`TESTING.md\`](TESTING.md)
${signals.seo?.hasMetaTags || signals.profile === 'public-web' || signals.profile === 'saas' ? '- Search & Discovery: [`SEO.md`](SEO.md)\n' : ''}
## Critical Rules
1. **Reuse First:** Always search existing components, utils, and abstractions before writing new code.
2. **Follow Stack:** Never introduce new frameworks or duplicate styling libraries without explicit justification.
3. **Preserve Architecture:** Respect ADRs in \`DECISIONS.md\`. Do not rewrite architecture unprompted.
4. **Targeted Validation:** Run relevant tests for changed areas. Do not fabricate test or security passes.
`;
    generated.push({ fileName: 'INDEX.md', relativePath: path.join(MEMORY_DIR, 'INDEX.md'), content: indexContent });

    // 2. PROJECT.md
    const projectContent = `# Project Overview

## Product Summary
- **Name:** ${projectName}
- **Profile:** ${signals.profile}
- **Summary:** ${signals.summary}

## Evidence
${Object.entries(signals.evidence).map(([k, v]) => `- **${k}:** ${v.join(', ')}`).join('\n')}

## Core Objectives
- Maintain clean, maintainable architecture.
- Enforce strict reuse of existing patterns and libraries.
- Keep dependency footprint lean and secure.
`;
    generated.push({ fileName: 'PROJECT.md', relativePath: path.join(MEMORY_DIR, 'PROJECT.md'), content: projectContent });

    // 3. STACK.md
    const stackContent = `# Technology Stack

**Verified on:** ${now}  
**Confidence:** HIGH  

| Layer | Technology | Status | Evidence |
| :--- | :--- | :--- | :--- |
| **Language** | ${signals.languages.join(', ') || 'Unknown'} | CONFIRMED | Source file extensions |
| **Package Manager** | ${signals.packageManager || 'Standard'} | CONFIRMED | Lockfiles / manifests |
| **Frontend** | ${signals.frontend?.framework || 'N/A'} | ${signals.frontend?.framework ? 'CONFIRMED' : 'NONE'} | ${signals.evidence['Frontend']?.join(', ') || 'No frontend manifest'} |
| **UI / Styling** | ${[...(signals.frontend?.uiLibraries || []), ...(signals.frontend?.styling || [])].join(', ') || 'Standard CSS'} | CONFIRMED | ${signals.evidence['Styling']?.join(', ') || signals.evidence['UI']?.join(', ') || 'None'} |
| **Backend** | ${signals.backend?.framework || 'N/A'} | ${signals.backend?.framework ? 'CONFIRMED' : 'NONE'} | ${signals.evidence['Backend']?.join(', ') || 'No backend manifest'} |
| **Database / ORM** | ${[signals.database?.engine, signals.database?.orm].filter(Boolean).join(' with ') || 'N/A'} | ${signals.database?.engine || signals.database?.orm ? 'CONFIRMED' : 'NONE'} | ${signals.evidence['Database']?.join(', ') || 'None'} |
| **Testing** | ${signals.testing?.runners?.join(', ') || 'Standard test suite'} | CONFIRMED | ${signals.evidence['Testing']?.join(', ') || 'None'} |
| **DevOps / CI** | ${[signals.devOps?.hasDocker ? 'Docker' : null, signals.devOps?.ciProvider].filter(Boolean).join(', ') || 'N/A'} | CONFIRMED | ${signals.evidence['DevOps']?.join(', ') || 'None'} |
`;
    generated.push({ fileName: 'STACK.md', relativePath: path.join(MEMORY_DIR, 'STACK.md'), content: stackContent });

    // 4. ARCHITECTURE.md
    const archContent = `# System Architecture

## Architecture Overview
- **System Style:** ${signals.backend?.framework && signals.frontend?.framework ? 'Decoupled Client/Server (or Fullstack Framework)' : signals.backend?.framework ? 'Backend Service' : signals.frontend?.framework ? 'Single Page / Static Web Application' : 'Modular Application / Library'}
- **Primary Runtime:** ${signals.primaryLanguage} (${signals.backend?.runtime || 'Node.js / Browser'})
- **API Style:** ${signals.backend?.apiStyle || 'REST / Standard Modules'}

## Architectural Principles
1. **Separation of Concerns:** Keep business logic separated from presentation and I/O handlers.
2. **Reuse-First Ladder:** Existing Project Code -> Shared Abstraction -> Framework Native -> Existing Dependency -> Trusted New Dependency -> Custom Code.
3. **Type Safety:** Maintain strict typing without unnecessary escape hatches (\`any\`).
4. **Deterministic Testing:** Test units and critical integration paths deterministically.
`;
    generated.push({ fileName: 'ARCHITECTURE.md', relativePath: path.join(MEMORY_DIR, 'ARCHITECTURE.md'), content: archContent });

    // 5. STRUCTURE.md
    const structureContent = `# Directory Structure

## Important Directories
\`\`\`
${projectName}/
├── src/                  # Application source code
├── tests/                # Automated test suites
├── .ai/                  # Project memory layer & AI index
└── package.json          # Dependency & build manifests
\`\`\`

## Key Directory Guidelines
- **Source Files:** Placed under appropriate feature or module directories.
- **Shared Code:** Reusable helpers, design tokens, and components reside in shared locations.
- **Tests:** Placed alongside source or mirrored in \`tests/\`.
`;
    generated.push({ fileName: 'STRUCTURE.md', relativePath: path.join(MEMORY_DIR, 'STRUCTURE.md'), content: structureContent });

    // 6. CONVENTIONS.md
    const conventionsContent = `# Code Conventions

## General Guidelines
- **Formatting:** Adhere to existing project linting and formatting configuration.
- **Comments:** Document *why*, not *what*. Explain non-obvious business logic, security decisions, or tricky edge cases. Do not write filler comments.
- **Naming:** Follow language-standard naming (camelCase for JS/TS variables & functions, PascalCase for classes & React components, kebab-case for filenames where existing).
- **Error Handling:** Use typed custom error classes or structured errors. Never swallow errors silently.
`;
    generated.push({ fileName: 'CONVENTIONS.md', relativePath: path.join(MEMORY_DIR, 'CONVENTIONS.md'), content: conventionsContent });

    // 7. DECISIONS.md (Architecture Decision Records)
    const decisionsContent = `# Architecture Decision Records (ADRs)

## ADR-001 — Technology Stack & Baseline Architecture
**Status:** Accepted  
**Date:** ${now}  

### Context
Initial project bootstrapping and architecture establishment for ${projectName}.

### Decision
Use ${signals.primaryLanguage}${signals.frontend?.framework ? ` with ${signals.frontend.framework}` : ''}${signals.backend?.framework ? ` and ${signals.backend.framework}` : ''}.

### Tradeoffs
- Balanced ecosystem maturity, developer productivity, and performance.

### Evidence
- Manifest and source structure verified during initial project indexing.
`;
    generated.push({ fileName: 'DECISIONS.md', relativePath: path.join(MEMORY_DIR, 'DECISIONS.md'), content: decisionsContent });

    // 8. DEPENDENCIES.md
    const allManifestDeps: string[] = [];
    for (const m of manifests) {
      for (const [dep, ver] of Object.entries(m.dependencies)) {
        allManifestDeps.push(`- **\`${dep}\`** (\`${ver}\`): Production dependency`);
      }
    }
    const dependenciesContent = `# Dependency Governance

**Last Verified:** ${now}  
**Audit Policy:** Require automated vulnerability & license checks before adding new packages.

## Recorded Dependencies
${allManifestDeps.length > 0 ? allManifestDeps.join('\n') : '- No external production dependencies detected.'}

## Policy for New Dependencies
1. Check if existing installed packages or framework built-ins already solve the problem.
2. Evaluate maintenance activity, security history, and license compatibility (e.g. MIT, Apache-2.0, BSD).
3. Do not add packages for trivial operations easily handled by 5-10 lines of standard code.
`;
    generated.push({ fileName: 'DEPENDENCIES.md', relativePath: path.join(MEMORY_DIR, 'DEPENDENCIES.md'), content: dependenciesContent });

    // 9. SECURITY.md
    const securityContent = `# Security Policy & Controls

**Status:** ACTIVE  
**Last Verified:** ${now}  

## Baseline Controls
- **Input Validation:** Validate all external inputs at system boundaries.
- **Secrets Management:** Never commit secrets, API keys, or private certificates to source control. Use environment variables.
- **Authentication & Authorization:** Enforce strict access control on all sensitive endpoints and database operations.
- **Safe Execution:** Avoid arbitrary shell execution or unsafe deserialization.
`;
    generated.push({ fileName: 'SECURITY.md', relativePath: path.join(MEMORY_DIR, 'SECURITY.md'), content: securityContent });

    // 10. UI.md
    const uiContent = `# UI & Design System

## Design Tokens & Styling
- **Styling Solution:** ${signals.frontend?.styling?.join(', ') || signals.frontend?.uiLibraries?.join(', ') || 'Vanilla CSS / Modular CSS'}
- **Component System:** ${signals.frontend?.uiLibraries?.join(', ') || 'Custom components'}

## Reuse Policy
- Always inspect existing UI components before writing new ones.
- Reuse modals, buttons, dropdowns, form controls, and toast notifications.
`;
    generated.push({ fileName: 'UI.md', relativePath: path.join(MEMORY_DIR, 'UI.md'), content: uiContent });

    // 11. API.md
    const apiContent = `# API Guidelines

## Endpoints & Communication
- **API Style:** ${signals.backend?.apiStyle || 'REST'}
- **Serialization:** JSON / UTF-8
- **Status Codes:** Use standard HTTP status codes (200, 201, 400, 401, 403, 404, 500).
`;
    generated.push({ fileName: 'API.md', relativePath: path.join(MEMORY_DIR, 'API.md'), content: apiContent });

    // 12. DATABASE.md
    const databaseContent = `# Database & Persistence

## Storage Engine
- **Database Engine:** ${signals.database?.engine || 'N/A'}
- **ORM / Query Builder:** ${signals.database?.orm || 'N/A'}
- **Migrations:** ${signals.database?.hasMigrations ? 'Managed via migration files' : 'None detected'}
`;
    generated.push({ fileName: 'DATABASE.md', relativePath: path.join(MEMORY_DIR, 'DATABASE.md'), content: databaseContent });

    // 13. TESTING.md
    const testingContent = `# Testing Strategy

## Test Framework
- **Test Runners:** ${signals.testing?.runners?.join(', ') || 'Configured test runner'}
- **E2E Framework:** ${signals.testing?.e2e?.join(', ') || 'None detected'}

## Verification Policy
- Run targeted unit tests on modified code.
- Do not claim tests passed without executing them.
`;
    generated.push({ fileName: 'TESTING.md', relativePath: path.join(MEMORY_DIR, 'TESTING.md'), content: testingContent });

    // 14. SEO.md
    const seoContent = `# Search Engine Optimization (SEO)

## Configuration
- **Sitemap:** ${signals.seo?.hasSitemap ? 'Configured' : 'Not configured'}
- **Robots.txt:** ${signals.seo?.hasRobots ? 'Configured' : 'Not configured'}

## Public Web Guidance
- Ensure descriptive \`<title>\` and \`<meta name="description">\` on public landing/content pages.
- Use semantic HTML with proper heading hierarchy (single \`<h1>\` per page).
`;
    generated.push({ fileName: 'SEO.md', relativePath: path.join(MEMORY_DIR, 'SEO.md'), content: seoContent });

    // 15. AGENT-CONTRACT.md
    const contractContent = `# Coding Agent Operational Contract

As an AI coding agent working in this repository, you agree to:
1. **Read \`.ai/INDEX.md\` First:** Understand the project domain and context before applying non-trivial changes.
2. **Follow the Reuse-First Ladder:** Always look for existing code, components, hooks, and utilities before creating new ones.
3. **Respect Architecture Decisions:** Do not contradict accepted decisions in \`.ai/DECISIONS.md\`.
4. **Preserve Conventions:** Respect formatting, style, and comments philosophy in \`.ai/CONVENTIONS.md\`.
5. **Enforce Dependency Governance:** Do not install unnecessary packages without justification and security review.
6. **Maintain Truthful Verification:** Execute tests and checks. Never fabricate test passes or security claims.
7. **Keep Memory in Sync:** Update \`.ai/\` files when making architectural or stack changes.
`;
    generated.push({ fileName: 'AGENT-CONTRACT.md', relativePath: path.join(MEMORY_DIR, 'AGENT-CONTRACT.md'), content: contractContent });

    return generated;
  }

  public writeMemoryToDisk(workspaceRoot: string, files: GeneratedMemoryFile[], signals: ProjectSignals): string[] {
    const memoryDir = path.join(workspaceRoot, MEMORY_DIR);
    if (!fs.existsSync(memoryDir)) {
      fs.mkdirSync(memoryDir, { recursive: true });
    }

    const writtenPaths: string[] = [];

    for (const f of files) {
      const fullPath = path.join(workspaceRoot, f.relativePath);
      fs.writeFileSync(fullPath, f.content, 'utf8');
      writtenPaths.push(fullPath);
    }

    // Write .ai/project.json
    const state = createMachineProjectState(signals);
    const jsonPath = writeMachineProjectState(workspaceRoot, state);
    writtenPaths.push(jsonPath);

    // Also write concise root AGENTS.md if not present or needs update
    const agentsMdPath = path.join(workspaceRoot, 'AGENTS.md');
    const agentsMdContent = `# Agent Instructions for ${signals.name || path.basename(workspaceRoot)}

This repository uses **Tailor** for project intelligence and memory.

## Instructions
1. Read [\`.ai/INDEX.md\`](.ai/INDEX.md) before making non-trivial modifications.
2. Follow the **Reuse-First** engineering ladder: reuse existing components, utilities, and abstractions.
3. Respect architectural decisions in [\`.ai/DECISIONS.md\`](.ai/DECISIONS.md).
4. Run targeted tests and verify changes before completion.
`;
    fs.writeFileSync(agentsMdPath, agentsMdContent, 'utf8');
    writtenPaths.push(agentsMdPath);

    return writtenPaths;
  }
}
