import * as fs from 'node:fs';
import * as path from 'node:path';
import { FeatureSpec, TechnicalPlan, SpecTask, ReuseAuditItem } from './types.js';
import { createDefaultConstitution, writeConstitution } from './constitution.js';
import { TailorConfig } from '../config/schema.js';
import { findFiles } from '../scanner/file-finder.js';
import { CodeCataloger } from '../reuse/cataloger.js';

export class SpecManager {
  private workspaceRoot: string;
  private specsDir: string;
  private config: TailorConfig;

  constructor(workspaceRoot: string, config: TailorConfig) {
    this.workspaceRoot = workspaceRoot;
    this.specsDir = path.join(workspaceRoot, 'specs');
    this.config = config;
  }

  public initSpecSystem(projectName: string): { constitutionPath: string; specsDir: string } {
    if (!fs.existsSync(this.specsDir)) {
      fs.mkdirSync(this.specsDir, { recursive: true });
    }

    const constitution = createDefaultConstitution(projectName, this.config);
    const constitutionPath = writeConstitution(this.workspaceRoot, constitution);

    return {
      constitutionPath,
      specsDir: this.specsDir,
    };
  }

  public getNextSpecId(): string {
    if (!fs.existsSync(this.specsDir)) {
      fs.mkdirSync(this.specsDir, { recursive: true });
      return '001';
    }

    const entries = fs.readdirSync(this.specsDir, { withFileTypes: true });
    const dirNumbers = entries
      .filter((e) => e.isDirectory() && /^\d+/.test(e.name))
      .map((e) => {
        const match = e.name.match(/^(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });

    const nextNum = dirNumbers.length > 0 ? Math.max(...dirNumbers) + 1 : 1;
    return String(nextNum).padStart(3, '0');
  }

  public createSpec(rawName: string, title?: string, overview?: string): { specDir: string; specPath: string; spec: FeatureSpec } {
    if (!fs.existsSync(this.specsDir)) {
      fs.mkdirSync(this.specsDir, { recursive: true });
    }

    const sanitizedName = rawName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const id = this.getNextSpecId();
    const folderName = `${id}-${sanitizedName}`;
    const specDir = path.join(this.specsDir, folderName);
    fs.mkdirSync(specDir, { recursive: true });

    const specTitle = title || rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const specOverview = overview || `Specification for ${rawName}. Defines core requirements, user stories, and acceptance criteria.`;
    const now = new Date().toISOString();

    const spec: FeatureSpec = {
      id,
      name: sanitizedName,
      title: specTitle,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      overview: specOverview,
      userStories: [
        {
          title: `Primary User Journey for ${specTitle}`,
          asA: 'user',
          iWant: `to easily use the ${rawName} capability`,
          soThat: 'I can achieve my objective efficiently with zero friction',
          acceptanceCriteria: [
            'Requirement is clearly defined and testable',
            'Input validation and edge-case error states are handled gracefully',
            'Performance is optimal with zero redundant calculations or network calls',
          ],
        },
      ],
      requirements: [
        {
          id: 'REQ-1',
          title: `Core Functionality of ${specTitle}`,
          description: `Implement the foundational logic and interface for ${rawName}.`,
          priority: 'MUST',
        },
        {
          id: 'REQ-2',
          title: 'Resilience and Error Handling',
          description: 'Ensure graceful degradation when unexpected inputs or failures occur.',
          priority: 'MUST',
        },
      ],
      nonGoals: [
        'Do not rewrite unrelated modules or architectural layers.',
        'Do not add heavy external dependencies when native features suffice.',
      ],
      edgeCases: [
        'Empty / null / undefined input payloads.',
        'Network timeouts or external service unavailability.',
        'Concurrent access or race conditions.',
      ],
      securityConsiderations: [
        'Ensure proper authorization and authentication checks.',
        'Sanitize all user-controlled inputs before processing.',
        'Avoid logging sensitive credentials, tokens, or PII.',
      ],
    };

    const specMarkdown = this.formatSpecMarkdown(spec);
    const specPath = path.join(specDir, 'spec.md');
    fs.writeFileSync(specPath, specMarkdown, 'utf8');

    return {
      specDir,
      specPath,
      spec,
    };
  }

  public async generatePlan(specIdentifier: string): Promise<{ planPath: string; plan: TechnicalPlan }> {
    const specDir = this.findSpecDir(specIdentifier);
    if (!specDir) {
      throw new Error(`Specification directory not found for: ${specIdentifier}`);
    }

    const specTitle = path.basename(specDir);

    // Run Tailor AST component & util cataloger to find reusable elements
    const files = findFiles(this.workspaceRoot);
    const cataloger = new CodeCataloger();
    const catalog = cataloger.catalogProject(this.workspaceRoot, files);

    const reuseItems: ReuseAuditItem[] = [];

    // Check catalog items for common matching patterns
    for (const comp of catalog.components.slice(0, 5)) {
      reuseItems.push({
        requestedEntity: comp.name,
        existingMatch: comp.filePath,
        matchType: 'COMPONENT',
        action: 'REUSE',
        rationale: `Existing component at ${comp.filePath} can be reused or composed.`,
      });
    }

    for (const util of catalog.utilities.slice(0, 5)) {
      reuseItems.push({
        requestedEntity: util.name,
        existingMatch: util.filePath,
        matchType: 'UTIL',
        action: 'REUSE',
        rationale: `Existing helper at ${util.filePath} can provide required logic.`,
      });
    }

    if (reuseItems.length === 0) {
      reuseItems.push({
        requestedEntity: 'Native Platform & Standard Library',
        existingMatch: 'Node.js / Browser APIs',
        matchType: 'STDLIB',
        action: 'REUSE',
        rationale: 'Use built-in language and runtime primitives; avoid adding new micro-packages.',
      });
    }

    const plan: TechnicalPlan = {
      specId: path.basename(specDir).split('-')[0],
      title: `Technical Implementation Plan: ${specTitle}`,
      createdAt: new Date().toISOString(),
      architectureOverview: `Implementation architecture for ${specTitle}. Respects existing project conventions and strictly enforces the Reuse-First ladder.`,
      affectedModules: ['src/'],
      reuseAudit: reuseItems,
      proposedFiles: [
        {
          action: 'CREATE',
          path: `src/${path.basename(specDir).split('-').slice(1).join('-')}.ts`,
          description: `Core implementation for ${specTitle}`,
        },
        {
          action: 'CREATE',
          path: `tests/unit/${path.basename(specDir).split('-').slice(1).join('-')}.test.ts`,
          description: `Targeted unit tests verifying ${specTitle}`,
        },
      ],
      dependenciesRequired: [],
      testingStrategy: {
        unitTests: ['Verify valid input execution', 'Verify invalid input rejection', 'Verify edge cases'],
        integrationTests: ['Verify end-to-end flow with existing modules'],
        manualVerificationSteps: ['Execute feature via CLI or test harness', 'Check error logs'],
      },
      risksAndMitigations: [
        {
          risk: 'Potential duplicate logic or redundant utility creation',
          mitigation: 'Reuse-First ladder enforced; verified against AST component catalog.',
        },
      ],
    };

    const planMarkdown = this.formatPlanMarkdown(plan);
    const planPath = path.join(specDir, 'plan.md');
    fs.writeFileSync(planPath, planMarkdown, 'utf8');

    return { planPath, plan };
  }

  public generateTasks(specIdentifier: string): { tasksPath: string; tasks: SpecTask[] } {
    const specDir = this.findSpecDir(specIdentifier);
    if (!specDir) {
      throw new Error(`Specification directory not found for: ${specIdentifier}`);
    }

    const specId = path.basename(specDir).split('-')[0];
    const specSlug = path.basename(specDir).split('-').slice(1).join('-');

    const tasks: SpecTask[] = [
      {
        id: `${specId}-T1`,
        specId,
        order: 1,
        title: `Verify existing component & utility reuse candidates for ${specSlug}`,
        complexity: 'TRIVIAL',
        targetFiles: ['src/'],
        completed: false,
        notes: 'Check AST catalog to ensure no duplicated helpers or CSS tokens.',
      },
      {
        id: `${specId}-T2`,
        specId,
        order: 2,
        title: `Implement core interfaces and domain logic for ${specSlug}`,
        complexity: 'MEDIUM',
        targetFiles: [`src/${specSlug}.ts`],
        completed: false,
      },
      {
        id: `${specId}-T3`,
        specId,
        order: 3,
        title: `Write comprehensive unit tests in tests/unit/${specSlug}.test.ts`,
        complexity: 'SMALL',
        targetFiles: [`tests/unit/${specSlug}.test.ts`],
        completed: false,
      },
      {
        id: `${specId}-T4`,
        specId,
        order: 4,
        title: 'Run test suite and static security verification',
        complexity: 'SMALL',
        targetFiles: [],
        completed: false,
        notes: 'Truthful verification invariant: verify exit code 0.',
      },
    ];

    const tasksMarkdown = this.formatTasksMarkdown(tasks, path.basename(specDir));
    const tasksPath = path.join(specDir, 'tasks.md');
    fs.writeFileSync(tasksPath, tasksMarkdown, 'utf8');

    return { tasksPath, tasks };
  }

  public listSpecs(): { id: string; name: string; folder: string; hasSpec: boolean; hasPlan: boolean; hasTasks: boolean }[] {
    if (!fs.existsSync(this.specsDir)) {
      return [];
    }

    const entries = fs.readdirSync(this.specsDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => {
        const folder = e.name;
        const dirPath = path.join(this.specsDir, folder);
        const parts = folder.split('-');
        const id = parts[0];
        const name = parts.slice(1).join('-');
        return {
          id,
          name,
          folder,
          hasSpec: fs.existsSync(path.join(dirPath, 'spec.md')),
          hasPlan: fs.existsSync(path.join(dirPath, 'plan.md')),
          hasTasks: fs.existsSync(path.join(dirPath, 'tasks.md')),
        };
      });
  }

  private findSpecDir(identifier: string): string | null {
    if (!fs.existsSync(this.specsDir)) {
      return null;
    }

    const entries = fs.readdirSync(this.specsDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        if (e.name === identifier || e.name.startsWith(`${identifier}-`) || e.name.endsWith(`-${identifier}`)) {
          return path.join(this.specsDir, e.name);
        }
      }
    }
    return null;
  }

  private formatSpecMarkdown(spec: FeatureSpec): string {
    return `# Feature Specification: ${spec.title}

**Spec ID:** \`${spec.id}\` | **Status:** \`${spec.status}\` | **Created:** ${spec.createdAt.split('T')[0]}

---

## 1. Overview & Objectives
${spec.overview}

---

## 2. User Stories & Scenarios
${spec.userStories
  .map(
    (us, i) => `### Story ${i + 1}: ${us.title}
- **As a:** ${us.asA}
- **I want to:** ${us.iWant}
- **So that:** ${us.soThat}

**Acceptance Criteria:**
${us.acceptanceCriteria.map((ac) => `  - [ ] ${ac}`).join('\n')}`
  )
  .join('\n\n')}

---

## 3. Functional Requirements
${spec.requirements.map((r) => `- **[${r.priority}] ${r.id}:** ${r.title} — ${r.description}`).join('\n')}

---

## 4. Non-Goals & Scope Limits
${spec.nonGoals.map((ng) => `- ${ng}`).join('\n')}

---

## 5. Edge Cases & Resilience
${spec.edgeCases.map((ec) => `- ${ec}`).join('\n')}

---

## 6. Security & Privacy Considerations
${spec.securityConsiderations.map((sc) => `- ${sc}`).join('\n')}
`;
  }

  private formatPlanMarkdown(plan: TechnicalPlan): string {
    return `# ${plan.title}

**Spec ID:** \`${plan.specId}\` | **Created:** ${plan.createdAt.split('T')[0]}

---

## 1. Architecture Overview
${plan.architectureOverview}

---

## 2. Reuse-First Audit (Pre-Execution Discovery)
*Before writing any new implementation, the workspace was scanned for existing components and abstractions:*

| Entity / Concept | Match in Workspace | Type | Action | Rationale |
| :--- | :--- | :--- | :--- | :--- |
${plan.reuseAudit
  .map(
    (item) =>
      `| **${item.requestedEntity}** | \`${item.existingMatch || 'None'}\` | ${item.matchType} | **${item.action}** | ${item.rationale} |`
  )
  .join('\n')}

---

## 3. Proposed File Changes
| Action | File Path | Purpose |
| :--- | :--- | :--- |
${plan.proposedFiles.map((f) => `| **${f.action}** | \`${f.path}\` | ${f.description} |`).join('\n')}

---

## 4. External Dependencies
${
  plan.dependenciesRequired.length === 0
    ? '✅ **Zero new external dependencies required.** Leveraging existing installed packages and standard library.'
    : plan.dependenciesRequired.map((d) => `- \`${d}\``).join('\n')
}

---

## 5. Testing & Verification Strategy
- **Unit Tests:**
${plan.testingStrategy.unitTests.map((t) => `  - ${t}`).join('\n')}
- **Integration Tests:**
${plan.testingStrategy.integrationTests.map((t) => `  - ${t}`).join('\n')}
- **Manual / CLI Steps:**
${plan.testingStrategy.manualVerificationSteps.map((t) => `  - ${t}`).join('\n')}

---

## 6. Risk Mitigation
${plan.risksAndMitigations.map((rm) => `- **Risk:** ${rm.risk}  \n  *Mitigation:* ${rm.mitigation}`).join('\n\n')}
`;
  }

  private formatTasksMarkdown(tasks: SpecTask[], specName: string): string {
    return `# Actionable Tasks: ${specName}

*Granular, dependency-ordered checklist for agent execution.*

---

${tasks
  .map(
    (t) => `### [ ] Task ${t.order}: ${t.title}
- **ID:** \`${t.id}\`
- **Complexity:** \`${t.complexity}\`
- **Target Files:** ${t.targetFiles.length > 0 ? t.targetFiles.map((f) => `\`${f}\``).join(', ') : 'Verification only'}
${t.notes ? `- **Notes:** ${t.notes}` : ''}`
  )
  .join('\n\n')}
`;
  }
}
