import * as fs from 'node:fs';
import * as path from 'node:path';
import { ParsedManifest } from './manifests.js';
import { ProjectProfile } from '../core/types.js';
import { DiscoveredFile, ProjectSignals } from './types.js';

export class ProjectDetector {
  private evidence: Record<string, string[]> = {};

  private addEvidence(category: string, item: string) {
    if (!this.evidence[category]) {
      this.evidence[category] = [];
    }
    if (!this.evidence[category].includes(item)) {
      this.evidence[category].push(item);
    }
  }

  public detect(
    workspaceRoot: string,
    files: DiscoveredFile[],
    manifests: ParsedManifest[]
  ): ProjectSignals {
    this.evidence = {};

    // Determine if scanning a fixture directory directly
    const isDirectFixtureScan =
      workspaceRoot.includes('benchmarks/fixtures') ||
      workspaceRoot.includes('benchmarks\\fixtures') ||
      workspaceRoot.includes('tests/fixtures') ||
      workspaceRoot.includes('tests\\fixtures');

    // Filter out benchmarks/fixtures and tests/fixtures when detecting the parent project
    const activeFiles = isDirectFixtureScan
      ? files
      : files.filter((f) => {
          const norm = f.relativePath.replace(/\\/g, '/');
          return !norm.startsWith('benchmarks/fixtures') && !norm.startsWith('tests/fixtures');
        });

    const activeManifests = isDirectFixtureScan
      ? manifests
      : manifests.filter((m) => {
          const relPath = path.relative(workspaceRoot, m.filePath).replace(/\\/g, '/');
          return !relPath.startsWith('benchmarks/fixtures') && !relPath.startsWith('tests/fixtures');
        });

    const allDeps: Record<string, string> = {};
    for (const m of activeManifests) {
      Object.assign(allDeps, m.dependencies, m.devDependencies);
    }

    const fileRelPaths = new Set(activeFiles.map((f) => f.relativePath.toLowerCase()));
    const fileNames = new Set(activeFiles.map((f) => path.basename(f.relativePath).toLowerCase()));

    // 1. Language detection
    const languages: string[] = [];
    let hasTs = false;
    let hasJs = false;
    let hasPy = false;
    let hasGo = false;
    let hasRust = false;
    let hasPhp = false;
    let hasCsharp = false;
    let hasJava = false;

    for (const f of activeFiles) {
      if (f.extension === '.ts' || f.extension === '.tsx') hasTs = true;
      if (f.extension === '.js' || f.extension === '.jsx' || f.extension === '.mjs') hasJs = true;
      if (f.extension === '.py') hasPy = true;
      if (f.extension === '.go') hasGo = true;
      if (f.extension === '.rs') hasRust = true;
      if (f.extension === '.php') hasPhp = true;
      if (f.extension === '.cs') hasCsharp = true;
      if (f.extension === '.java' || f.extension === '.kt') hasJava = true;
    }

    if (hasTs) {
      languages.push('TypeScript');
      this.addEvidence('Language', 'Found .ts/.tsx source files');
    }
    if (hasJs && !hasTs) {
      languages.push('JavaScript');
      this.addEvidence('Language', 'Found .js/.jsx source files');
    }
    if (hasPy) {
      languages.push('Python');
      this.addEvidence('Language', 'Found .py source files');
    }
    if (hasGo) {
      languages.push('Go');
      this.addEvidence('Language', 'Found .go source files');
    }
    if (hasRust) {
      languages.push('Rust');
      this.addEvidence('Language', 'Found .rs source files');
    }
    if (hasPhp) {
      languages.push('PHP');
      this.addEvidence('Language', 'Found .php source files');
    }
    if (hasCsharp) {
      languages.push('C#/.NET');
      this.addEvidence('Language', 'Found .cs or .csproj files');
    }
    if (hasJava) {
      languages.push('Java/Kotlin');
      this.addEvidence('Language', 'Found .java/.kt files');
    }

    const primaryLanguage = languages[0] || 'Unknown';

    // 2. Package Manager
    let packageManager: string | undefined;
    if (fileNames.has('pnpm-lock.yaml')) {
      packageManager = 'pnpm';
      this.addEvidence('PackageManager', 'pnpm-lock.yaml');
    } else if (fileNames.has('yarn.lock')) {
      packageManager = 'yarn';
      this.addEvidence('PackageManager', 'yarn.lock');
    } else if (fileNames.has('bun.lockb') || fileNames.has('bun.lock')) {
      packageManager = 'bun';
      this.addEvidence('PackageManager', 'bun.lock');
    } else if (fileNames.has('package-lock.json')) {
      packageManager = 'npm';
      this.addEvidence('PackageManager', 'package-lock.json');
    } else if (hasPy && fileNames.has('poetry.lock')) {
      packageManager = 'poetry';
      this.addEvidence('PackageManager', 'poetry.lock');
    } else if (hasPy && fileNames.has('pipfile')) {
      packageManager = 'pipenv';
      this.addEvidence('PackageManager', 'Pipfile');
    } else if (hasPy && fileNames.has('requirements.txt')) {
      packageManager = 'pip';
      this.addEvidence('PackageManager', 'requirements.txt');
    } else if (hasGo && fileNames.has('go.mod')) {
      packageManager = 'go modules';
      this.addEvidence('PackageManager', 'go.mod');
    } else if (hasRust && fileNames.has('cargo.toml')) {
      packageManager = 'cargo';
      this.addEvidence('PackageManager', 'Cargo.toml');
    }

    // 3. Frontend Framework & UI
    let frontendFramework: string | undefined;
    const uiLibs: string[] = [];
    const styling: string[] = [];

    if (allDeps['next'] || fileNames.has('next.config.js') || fileNames.has('next.config.mjs') || fileNames.has('next.config.ts')) {
      frontendFramework = 'Next.js';
      this.addEvidence('Frontend', 'next dependency / config');
    } else if (allDeps['nuxt'] || fileNames.has('nuxt.config.ts') || fileNames.has('nuxt.config.js')) {
      frontendFramework = 'Nuxt';
      this.addEvidence('Frontend', 'nuxt dependency / config');
    } else if (allDeps['@remix-run/react'] || allDeps['@remix-run/node']) {
      frontendFramework = 'Remix';
      this.addEvidence('Frontend', 'remix dependency');
    } else if (allDeps['@sveltejs/kit'] || allDeps['svelte']) {
      frontendFramework = 'SvelteKit / Svelte';
      this.addEvidence('Frontend', 'svelte dependency');
    } else if (allDeps['@angular/core']) {
      frontendFramework = 'Angular';
      this.addEvidence('Frontend', '@angular/core dependency');
    } else if (allDeps['react'] || allDeps['react-dom']) {
      frontendFramework = allDeps['vite'] || fileNames.has('vite.config.ts') || fileNames.has('vite.config.js')
        ? 'React + Vite'
        : 'React';
      this.addEvidence('Frontend', 'react dependency');
    } else if (allDeps['vue']) {
      frontendFramework = 'Vue';
      this.addEvidence('Frontend', 'vue dependency');
    }

    if (allDeps['tailwindcss'] || fileNames.has('tailwind.config.js') || fileNames.has('tailwind.config.ts')) {
      styling.push('Tailwind CSS');
      this.addEvidence('Styling', 'tailwindcss dependency / config');
    }
    if (allDeps['@shadcn/ui'] || allDeps['clsx'] && allDeps['tailwind-merge'] && fileRelPaths.has('components.json')) {
      uiLibs.push('shadcn/ui');
      this.addEvidence('UI', 'shadcn components.json / primitives');
    }
    if (allDeps['@mui/material'] || allDeps['@material-ui/core']) {
      uiLibs.push('Material UI');
      this.addEvidence('UI', '@mui/material');
    }
    if (allDeps['@chakra-ui/react']) {
      uiLibs.push('Chakra UI');
      this.addEvidence('UI', '@chakra-ui/react');
    }
    if (allDeps['antd']) {
      uiLibs.push('Ant Design');
      this.addEvidence('UI', 'antd');
    }

    // 4. Backend Framework & API
    let backendFramework: string | undefined;
    let backendRuntime: string | undefined;
    let apiStyle: string | undefined;

    if (allDeps['django'] || fileNames.has('manage.py')) {
      backendFramework = 'Django';
      backendRuntime = 'Python';
      this.addEvidence('Backend', 'Django / manage.py');
    } else if (allDeps['flask']) {
      backendFramework = 'Flask';
      backendRuntime = 'Python';
      this.addEvidence('Backend', 'flask dependency');
    } else if (allDeps['fastapi']) {
      backendFramework = 'FastAPI';
      backendRuntime = 'Python';
      this.addEvidence('Backend', 'fastapi dependency');
    } else if (allDeps['express']) {
      backendFramework = 'Express';
      backendRuntime = 'Node.js';
      this.addEvidence('Backend', 'express dependency');
    } else if (allDeps['@nestjs/core']) {
      backendFramework = 'NestJS';
      backendRuntime = 'Node.js';
      this.addEvidence('Backend', '@nestjs/core dependency');
    } else if (allDeps['hono']) {
      backendFramework = 'Hono';
      backendRuntime = 'Node.js / Edge';
      this.addEvidence('Backend', 'hono dependency');
    } else if (allDeps['gin-gonic/gin'] || allDeps['github.com/gin-gonic/gin']) {
      backendFramework = 'Gin';
      backendRuntime = 'Go';
      this.addEvidence('Backend', 'gin dependency');
    } else if (allDeps['actix-web']) {
      backendFramework = 'Actix Web';
      backendRuntime = 'Rust';
      this.addEvidence('Backend', 'actix-web dependency');
    } else if (allDeps['laravel/framework'] || fileNames.has('artisan')) {
      backendFramework = 'Laravel';
      backendRuntime = 'PHP';
      this.addEvidence('Backend', 'laravel / artisan');
    } else if (hasCsharp && (fileRelPaths.has('program.cs') || fileRelPaths.has('startup.cs') || fileNames.has('program.cs'))) {
      backendFramework = 'ASP.NET Core';
      backendRuntime = '.NET';
      this.addEvidence('Backend', 'ASP.NET Core program.cs');
    }

    if (allDeps['@trpc/server']) {
      apiStyle = 'tRPC';
      this.addEvidence('API', 'tRPC server');
    } else if (allDeps['graphql'] || allDeps['@apollo/server']) {
      apiStyle = 'GraphQL';
      this.addEvidence('API', 'GraphQL dependency');
    } else if (backendFramework || frontendFramework) {
      apiStyle = 'REST';
      this.addEvidence('API', 'Standard REST endpoints');
    }

    // 5. Database & ORM
    let databaseEngine: string | undefined;
    let orm: string | undefined;
    let hasMigrations = false;

    if (allDeps['@prisma/client'] || fileNames.has('schema.prisma')) {
      orm = 'Prisma';
      this.addEvidence('Database', 'Prisma schema/client');
    } else if (allDeps['drizzle-orm']) {
      orm = 'Drizzle';
      this.addEvidence('Database', 'drizzle-orm dependency');
    } else if (allDeps['typeorm']) {
      orm = 'TypeORM';
      this.addEvidence('Database', 'typeorm dependency');
    } else if (allDeps['sqlalchemy']) {
      orm = 'SQLAlchemy';
      this.addEvidence('Database', 'sqlalchemy dependency');
    } else if (allDeps['mongoose']) {
      orm = 'Mongoose';
      databaseEngine = 'MongoDB';
      this.addEvidence('Database', 'mongoose dependency');
    }

    if (allDeps['pg'] || allDeps['postgres'] || allDeps['psycopg2'] || allDeps['psycopg2-binary']) {
      databaseEngine = 'PostgreSQL';
      this.addEvidence('Database', 'pg / psycopg2 driver');
    } else if (allDeps['mysql2'] || allDeps['mysql']) {
      databaseEngine = 'MySQL';
      this.addEvidence('Database', 'mysql driver');
    } else if (allDeps['sqlite3'] || allDeps['better-sqlite3']) {
      databaseEngine = 'SQLite';
      this.addEvidence('Database', 'sqlite driver');
    }

    if (
      fileRelPaths.has('prisma/migrations') ||
      fileRelPaths.has('migrations') ||
      fileRelPaths.has('alembic') ||
      fileRelPaths.has('database/migrations')
    ) {
      hasMigrations = true;
      this.addEvidence('Database', 'Found migrations directory');
    }

    // 6. Testing Runners
    const testRunners: string[] = [];
    const e2eRunners: string[] = [];

    if (allDeps['vitest']) {
      testRunners.push('Vitest');
      this.addEvidence('Testing', 'vitest dependency');
    }
    if (allDeps['jest']) {
      testRunners.push('Jest');
      this.addEvidence('Testing', 'jest dependency');
    }
    if (allDeps['pytest'] || allDeps['pytest-django']) {
      testRunners.push('Pytest');
      this.addEvidence('Testing', 'pytest dependency');
    }
    if (allDeps['@playwright/test']) {
      e2eRunners.push('Playwright');
      this.addEvidence('Testing', '@playwright/test');
    }
    if (allDeps['cypress']) {
      e2eRunners.push('Cypress');
      this.addEvidence('Testing', 'cypress dependency');
    }

    // 7. DevOps / Containerization / CI
    const hasDocker = fileNames.has('dockerfile');
    const hasDockerCompose = fileNames.has('docker-compose.yml') || fileNames.has('compose.yml') || fileNames.has('docker-compose.yaml');
    if (hasDocker) this.addEvidence('DevOps', 'Dockerfile detected');
    if (hasDockerCompose) this.addEvidence('DevOps', 'docker-compose.yml detected');

    let ciProvider: string | undefined;
    for (const f of activeFiles) {
      if (f.relativePath.startsWith('.github/workflows')) {
        ciProvider = 'GitHub Actions';
        this.addEvidence('DevOps', 'GitHub Actions workflows detected');
        break;
      }
    }

    // 8. Auth Solutions
    const authSolutions: string[] = [];
    if (allDeps['next-auth'] || allDeps['@auth/core']) {
      authSolutions.push('NextAuth / Auth.js');
      this.addEvidence('Security', 'NextAuth / Auth.js');
    }
    if (allDeps['@clerk/nextjs'] || allDeps['@clerk/clerk-react']) {
      authSolutions.push('Clerk');
      this.addEvidence('Security', 'Clerk auth');
    }
    if (allDeps['@supabase/auth-helpers-nextjs'] || allDeps['@supabase/supabase-js']) {
      authSolutions.push('Supabase Auth');
      this.addEvidence('Security', 'Supabase Auth');
    }
    if (allDeps['passport']) {
      authSolutions.push('Passport.js');
      this.addEvidence('Security', 'Passport.js');
    }

    // 9. SEO & Metadata
    const hasSitemap = fileNames.has('sitemap.xml') || fileNames.has('sitemap.ts') || fileNames.has('sitemap.js');
    const hasRobots = fileNames.has('robots.txt') || fileNames.has('robots.ts') || fileNames.has('robots.js');
    if (hasSitemap) this.addEvidence('SEO', 'Sitemap file detected');
    if (hasRobots) this.addEvidence('SEO', 'robots.txt detected');

    // 10. Profile Classification
    let profile: ProjectProfile = 'generic';
    if (frontendFramework && backendFramework) {
      profile = 'saas';
    } else if (frontendFramework && (hasSitemap || hasRobots || frontendFramework === 'Next.js' || frontendFramework === 'Nuxt')) {
      profile = 'public-web';
    } else if (backendFramework && !frontendFramework) {
      profile = 'api';
    } else if (fileNames.has('app.json') && (allDeps['react-native'] || allDeps['expo'])) {
      profile = 'mobile';
    } else if (allDeps['commander'] || allDeps['yargs'] || allDeps['cac']) {
      profile = 'cli';
    } else if (!frontendFramework && !backendFramework && (allDeps['typescript'] || fileNames.has('tsconfig.json'))) {
      profile = 'library';
    }

    // Generate summary
    const projectName = activeManifests[0]?.projectName || path.basename(workspaceRoot);
    const summary = `${projectName} (${profile}) built with ${primaryLanguage}${frontendFramework ? ` [Frontend: ${frontendFramework}]` : ''}${backendFramework ? ` [Backend: ${backendFramework}]` : ''}${databaseEngine ? ` [DB: ${databaseEngine}]` : ''}`;

    return {
      name: projectName,
      languages,
      primaryLanguage,
      packageManager,
      frontend: frontendFramework ? {
        framework: frontendFramework,
        uiLibraries: uiLibs.length > 0 ? uiLibs : undefined,
        styling: styling.length > 0 ? styling : undefined,
      } : undefined,
      backend: backendFramework ? {
        framework: backendFramework,
        runtime: backendRuntime,
        apiStyle,
      } : undefined,
      database: (databaseEngine || orm) ? {
        engine: databaseEngine,
        orm,
        hasMigrations,
      } : undefined,
      testing: (testRunners.length > 0 || e2eRunners.length > 0) ? {
        runners: testRunners,
        e2e: e2eRunners,
      } : undefined,
      devOps: {
        containerized: hasDocker || hasDockerCompose,
        hasDocker,
        hasDockerCompose,
        ciProvider,
      },
      security: {
        authSolutions: authSolutions.length > 0 ? authSolutions : undefined,
      },
      seo: {
        hasSitemap,
        hasRobots,
        hasMetaTags: hasSitemap || hasRobots,
      },
      profile,
      evidence: this.evidence,
      summary,
    };
  }
}
