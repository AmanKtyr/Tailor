export class TailorError extends Error {
  public readonly code: string;
  public readonly remediation?: string;

  constructor(message: string, code = 'TAILOR_ERROR', remediation?: string) {
    super(message);
    this.name = 'TailorError';
    this.code = code;
    this.remediation = remediation;
  }
}

export class MemoryNotFoundError extends TailorError {
  constructor(path: string) {
    super(
      `Project memory file not found: ${path}`,
      'MEMORY_NOT_FOUND',
      'Run `tailor memory update` or `tailor init` to generate project memory files.'
    );
  }
}

export class ManifestParseError extends TailorError {
  constructor(filePath: string, reason: string) {
    super(
      `Failed to parse manifest at ${filePath}: ${reason}`,
      'MANIFEST_PARSE_ERROR',
      'Verify file syntax and formatting.'
    );
  }
}

export class SecurityCheckError extends TailorError {
  constructor(toolName: string, reason: string) {
    super(
      `Security check using ${toolName} failed: ${reason}`,
      'SECURITY_CHECK_ERROR',
      'Ensure the required tool is installed or run with --fallback mode.'
    );
  }
}
