import { ProjectProfile } from '../core/types.js';
import { PragmatismIntensity } from '../pragmatism/types.js';
import { SupportedLocale } from '../i18n/types.js';

export interface TailorConfig {
  profile?: ProjectProfile;
  intensity?: PragmatismIntensity;
  locale?: SupportedLocale;
  memory?: {
    enabled?: boolean;
    directory?: string;
    autoUpdate?: boolean;
    files?: string[];
  };
  specs?: {
    enabled?: boolean;
    directory?: string;
  };
  adapters?: {
    autoSync?: boolean;
    targets?: string[];
  };
  security?: {
    level?: 'standard' | 'high' | 'strict';
    requireAudit?: boolean;
    blockOnCritical?: boolean;
    secretScanPatterns?: string[];
  };
  seo?: {
    enabled?: boolean;
    sitemapPath?: string;
    robotsPath?: string;
  };
  dependencies?: {
    requireAudit?: boolean;
    allowedLicenses?: string[];
    disallowedPackages?: string[];
  };
  reuse?: {
    enabled?: boolean;
    componentDirectories?: string[];
    searchDepth?: number;
  };
  ignore?: string[];
}

export const DEFAULT_CONFIG: TailorConfig = {
  profile: 'generic',
  intensity: 'balanced',
  locale: 'en',
  memory: {
    enabled: true,
    directory: '.ai',
    autoUpdate: false,
  },
  specs: {
    enabled: true,
    directory: 'specs',
  },
  adapters: {
    autoSync: true,
  },
  security: {
    level: 'high',
    requireAudit: true,
    blockOnCritical: true,
  },
  seo: {
    enabled: false,
  },
  dependencies: {
    requireAudit: true,
    allowedLicenses: ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'BSD-2-Clause', 'ISC', '0BSD', 'CC0-1.0', 'Unlicense'],
  },
  reuse: {
    enabled: true,
    componentDirectories: ['src/components', 'components', 'src/ui', 'ui', 'src/lib', 'lib', 'src/utils', 'utils'],
    searchDepth: 6,
  },
  ignore: [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    '.next',
    '.nuxt',
    '.cache',
    'target',
    'bin',
    'obj',
  ],
};
