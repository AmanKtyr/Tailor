import pc from 'picocolors';

export interface LoggerOptions {
  quiet?: boolean;
  verbose?: boolean;
  json?: boolean;
}

class Logger {
  private quiet = false;
  private verbose = false;
  private json = false;

  public configure(opts: LoggerOptions): void {
    if (opts.quiet !== undefined) this.quiet = opts.quiet;
    if (opts.verbose !== undefined) this.verbose = opts.verbose;
    if (opts.json !== undefined) this.json = opts.json;
  }

  public info(msg: string): void {
    if (this.quiet || this.json) return;
    console.log(pc.cyan('ℹ ') + msg);
  }

  public success(msg: string): void {
    if (this.quiet || this.json) return;
    console.log(pc.green('✔ ') + msg);
  }

  public warn(msg: string): void {
    if (this.json) return;
    console.warn(pc.yellow('⚠ ') + pc.yellow(msg));
  }

  public error(msg: string): void {
    if (this.json) return;
    console.error(pc.red('✖ ') + pc.red(msg));
  }

  public debug(msg: string): void {
    if (!this.verbose || this.quiet || this.json) return;
    console.log(pc.dim('⚙ ' + msg));
  }

  public log(msg: string): void {
    if (this.quiet || this.json) return;
    console.log(msg);
  }

  public rawJson(data: unknown): void {
    console.log(JSON.stringify(data, null, 2));
  }
}

export const logger = new Logger();
