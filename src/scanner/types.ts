import { ProjectProfile } from '../core/types.js';

export interface ProjectSignals {
  name?: string;
  languages: string[];
  primaryLanguage: string;
  packageManager?: string;
  frontend?: {
    framework?: string;
    uiLibraries?: string[];
    routing?: string;
    styling?: string[];
  };
  backend?: {
    framework?: string;
    runtime?: string;
    apiStyle?: string;
  };
  database?: {
    engine?: string;
    orm?: string;
    hasMigrations?: boolean;
    migrationTool?: string;
  };
  caching?: string[];
  testing?: {
    runners?: string[];
    e2e?: string[];
    coverage?: string;
  };
  devOps?: {
    containerized?: boolean;
    hasDocker?: boolean;
    hasDockerCompose?: boolean;
    ciProvider?: string;
  };
  security?: {
    authSolutions?: string[];
    secretManagement?: string[];
  };
  seo?: {
    hasSitemap?: boolean;
    hasRobots?: boolean;
    hasMetaTags?: boolean;
  };
  profile: ProjectProfile;
  evidence: Record<string, string[]>;
  summary: string;
}

export interface DiscoveredFile {
  relativePath: string;
  absolutePath: string;
  size: number;
  extension: string;
}
