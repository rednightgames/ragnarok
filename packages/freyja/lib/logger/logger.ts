import CI from "ci-info";
import {Writable} from "stream";

import {applyStyle, formatCode, pretty, Style, Type} from "./helpers";
import {MessageName} from "./messageNames";

export type LoggerOptions = {
  includeFooter?: boolean;
  includeVersion?: boolean;
  stdout: Writable;
};

export type SectionOptions = {
  reportHeader?: () => void;
  reportFooter?: (elapsedTime: number) => void;
  skipIfEmpty?: boolean;
};

export type TimerOptions = Pick<SectionOptions, "skipIfEmpty">;

export const SINGLE_LINE_CHAR = "·";

const GROUP = (() => {
  if (CI.GITHUB_ACTIONS) {
    return {
      start: (what: string) => `::group::${what}\n`,
      end: () => "::endgroup::\n",
    };
  }
  if (CI.TRAVIS) {
    return {
      start: (what: string) => `travis_fold:start:${what}\n`,
      end: (what: string) => `travis_fold:end:${what}\n`,
    };
  }
  if (CI.GITLAB) {
    return {
      start: (what: string) =>
        `section_start:${Math.floor(Date.now() / 1000)}:${what.toLowerCase().replace(/\W+/g, "_")}[collapsed=true]\r\x1B[0K${what}\n`,
      end: (what: string) =>
        `section_end:${Math.floor(Date.now() / 1000)}:${what.toLowerCase().replace(/\W+/g, "_")}\r\x1B[0K`,
    };
  }
  return null;
})();

export class Logger {
  static async start(
    opts: LoggerOptions,
    cb: (report: Logger) => Promise<void>,
  ) {
    const logger = new this(opts);

    const emitWarning = process.emitWarning;
    process.emitWarning = (message, name) => {
      if (typeof message !== "string") {
        const error = message;

        message = error.message;
        name = name ?? error.name;
      }

      const fullMessage =
        typeof name !== "undefined" ? `${name}: ${message}` : message;

      logger.reportWarning(MessageName.UNNAMED, fullMessage);
    };

    if (opts.includeVersion) {
      logger.reportInfo(
        MessageName.UNNAMED,
        applyStyle(`Freyja ${FREYJA_VERSION}`, Style.BOLD),
      );
    }

    try {
      await cb(logger);
    } catch (error) {
      logger.reportException(error as Error);
    } finally {
      await logger.finalize();
      process.emitWarning = emitWarning;
    }

    return logger;
  }

  private readonly includeFooter: boolean;
  private stdout: Writable;

  private uncommitted = new Set<{
    committed: boolean;
    action: () => void;
  }>();

  private warningCount: number = 0;
  private errorCount: number = 0;

  private timerFooter: (() => void)[] = [];

  private startTime: number = Date.now();

  private indent: number = 0;
  private level: number = 0;

  constructor({stdout, includeFooter = true}: LoggerOptions) {
    this.includeFooter = includeFooter;
    this.stdout = stdout;
  }

  hasErrors() {
    return this.errorCount > 0;
  }

  exitCode() {
    return this.hasErrors() ? 1 : 0;
  }

  startSectionSync<T>(
    {reportHeader, reportFooter, skipIfEmpty}: SectionOptions,
    cb: () => T,
  ) {
    const mark = {
      committed: false,
      action: () => {
        reportHeader?.();
      },
    };

    if (skipIfEmpty) {
      this.uncommitted.add(mark);
    } else {
      mark.action();
      mark.committed = true;
    }

    const before = Date.now();

    try {
      return cb();
    } catch (error) {
      this.reportException(error as Error);
      throw error;
    } finally {
      const after = Date.now();

      this.uncommitted.delete(mark);
      if (mark.committed) {
        reportFooter?.(after - before);
      }
    }
  }

  async startSectionPromise<T>(
    {reportHeader, reportFooter, skipIfEmpty}: SectionOptions,
    cb: () => Promise<T>,
  ) {
    const mark = {
      committed: false,
      action: () => {
        reportHeader?.();
      },
    };

    if (skipIfEmpty) {
      this.uncommitted.add(mark);
    } else {
      mark.action();
      mark.committed = true;
    }

    const before = Date.now();

    try {
      return await cb();
    } catch (error) {
      this.reportException(error as Error);
      throw error;
    } finally {
      const after = Date.now();

      this.uncommitted.delete(mark);
      if (mark.committed) {
        reportFooter?.(after - before);
      }
    }
  }

  private startTimerImpl<Callback extends Function>(
    what: string,
    opts: TimerOptions | Callback,
    cb?: Callback,
  ) {
    const realOpts = typeof opts === "function" ? {} : opts;
    const realCb = typeof opts === "function" ? opts : cb!;

    return {
      cb: realCb,
      reportHeader: () => {
        this.level += 1;

        this.reportInfo(null, `┌ ${what}`);
        this.indent += 1;

        if (GROUP !== null) {
          this.stdout.write(GROUP.start(what));
        }
      },
      reportFooter: (elapsedTime) => {
        this.indent -= 1;

        if (GROUP !== null) {
          this.stdout.write(GROUP.end(what));
          for (const cb of this.timerFooter) {
            cb();
          }
        }

        if (elapsedTime > 200) {
          this.reportInfo(
            null,
            `└ Completed in ${pretty(elapsedTime, Type.DURATION)}`,
          );
        } else {
          this.reportInfo(null, "└ Completed");
        }

        this.level -= 1;
      },
      skipIfEmpty: realOpts.skipIfEmpty,
    } as SectionOptions & {cb: Callback};
  }

  startTimerSync<T>(what: string, opts: TimerOptions, cb: () => T): T;
  startTimerSync<T>(what: string, cb: () => T): T;
  startTimerSync<T>(
    what: string,
    opts: TimerOptions | (() => T),
    cb?: () => T,
  ) {
    const {cb: realCb, ...sectionOps} = this.startTimerImpl(what, opts, cb);
    return this.startSectionSync(sectionOps, realCb);
  }

  async startTimerPromise<T>(
    what: string,
    opts: TimerOptions,
    cb: () => Promise<T>,
  ): Promise<T>;
  async startTimerPromise<T>(what: string, cb: () => Promise<T>): Promise<T>;
  async startTimerPromise<T>(
    what: string,
    opts: TimerOptions | (() => Promise<T>),
    cb?: () => Promise<T>,
  ) {
    const {cb: realCb, ...sectionOps} = this.startTimerImpl(what, opts, cb);
    return this.startSectionPromise(sectionOps, realCb);
  }

  reportSeparator() {
    if (this.indent === 0) {
      this.writeLine("");
    } else {
      this.reportInfo(null, "");
    }
  }

  reportInfo(name: MessageName | null, text: string) {
    const formattedCode = formatCode(name);
    const prefix = formattedCode ? `${formattedCode}: ` : "";
    const message = `${this.formatPrefix(prefix, "magentaBright")}${text}`;

    this.writeLine(message);
  }

  reportWarning(name: MessageName, text: string) {
    this.warningCount += 1;

    const formattedCode = formatCode(name);
    const prefix = formattedCode ? `${formattedCode}: ` : "";

    this.writeLine(`${this.formatPrefix(prefix, "yellowBright")}${text}`);
  }

  reportException(error: Error) {
    this.reportError(MessageName.EXCEPTION, error.stack || error.message);
  }

  reportError(name: MessageName, text: string) {
    this.errorCount += 1;
    this.timerFooter.push(() => this.reportErrorImpl(name, text));

    this.reportErrorImpl(name, text);
  }

  private reportErrorImpl(name: MessageName, text: string) {
    const formattedCode = formatCode(name);
    const prefix = formattedCode ? `${formattedCode}: ` : "";

    this.writeLine(`${this.formatPrefix(prefix, "redBright")}${text}`);
  }

  async finalize() {
    if (!this.includeFooter) {
      return;
    }

    this.level = 0;
    let installStatus = "";

    if (this.errorCount > 0) {
      installStatus = "Failed with errors";
    } else if (this.warningCount > 0) {
      installStatus = "Done with warnings";
    } else {
      installStatus = "Done";
    }

    const timing = pretty(`${Date.now() - this.startTime}`, Type.DURATION);
    const message = `${installStatus} in ${timing}`;

    if (this.errorCount > 0) {
      this.reportError(MessageName.UNNAMED, message);
    } else if (this.warningCount > 0) {
      this.reportWarning(MessageName.UNNAMED, message);
    } else {
      this.reportInfo(MessageName.UNNAMED, message);
    }
  }

  private writeLine(str: string) {
    this.stdout.write(`${str}\n`);
  }

  private formatPrefix(prefix: string, caretColor: string) {
    return `${pretty("➤", caretColor)} ${prefix}${this.formatIndent()}`;
  }

  private formatIndent() {
    return (() => {
      if (this.level > 0) {
        return "│ ".repeat(this.indent);
      }
      return `${SINGLE_LINE_CHAR} `;
    })();
  }
}
