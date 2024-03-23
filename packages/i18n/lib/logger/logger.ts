/* eslint-disable promise/avoid-new */
/* eslint-disable ts/no-misused-promises */
import CI from "ci-info";
import throttle from "lodash/throttle";
import {Writable} from "stream";

import {ReportError} from "./error";
import {
  applyStyle,
  formatCode,
  formatName,
  isReportError,
  pretty,
  Style,
  Type,
} from "./helpers";
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

export type ProgressDefinition = {
  progress?: number;
  title?: string;
};

export type ProgressIterable = AsyncIterable<ProgressDefinition> & {
  hasProgress: boolean;
  hasTitle: boolean;
};

const SINGLE_LINE_CHAR = "·";

const TITLE_PROGRESS_FPS = 15;

const PROGRESS_FRAMES = [`⠋`, `⠙`, `⠹`, `⠸`, `⠼`, `⠴`, `⠦`, `⠧`, `⠇`, `⠏`];
const PROGRESS_INTERVAL = 80;

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
        `section_start:${Math.floor(Date.now() / 1000)}:${what
          .toLowerCase()
          .replace(/\W+/g, "_")}[collapsed=true]\r\x1B[0K${what}\n`,
      end: (what: string) =>
        `section_end:${Math.floor(Date.now() / 1000)}:${what
          .toLowerCase()
          .replace(/\W+/g, "_")}\r\x1B[0K`,
    };
  }
  return null;
})();

export class Logger {
  private reportedInfos: Set<any> = new Set();
  private reportedWarnings: Set<any> = new Set();
  private reportedErrors: Set<any> = new Set();

  private includeFooter: boolean;
  private stdout: Writable;
  private uncommitted: Set<{
    committed: boolean;
    action: () => void;
  }> = new Set();

  private warningCount: number = 0;
  private errorCount: number = 0;
  private timerFooter: (() => void)[] = [];
  private startTime: number = Date.now();
  private indent: number = 0;
  private level: number = 0;

  private progress: Map<
    ProgressIterable,
    {
      definition: ProgressDefinition;
      lastScaledSize?: number;
      lastTitle?: string;
    }
  > = new Map();

  private progressTime: number = 0;
  private progressFrame: number = 0;
  private progressTimeout: ReturnType<typeof setTimeout> | null = null;
  private progressStyle: {date?: number[]; chars: string[]; size: number};
  private progressMaxScaledSize: number | null = null;

  constructor({stdout, includeFooter = true}: LoggerOptions) {
    this.includeFooter = includeFooter;
    this.stdout = stdout;

    this.progressStyle = {
      chars: [`=`, `-`],
      size: 80,
    };
    const maxWidth = Math.min(this.getRecommendedLength(), 80);
    this.progressMaxScaledSize = Math.floor(
      (this.progressStyle.size * maxWidth) / 80,
    );
  }

  hasErrors() {
    return this.errorCount > 0;
  }

  exitCode() {
    return this.hasErrors() ? 1 : 0;
  }

  getRecommendedLength() {
    const PREFIX_SIZE = `➤ ED0000: ⠋ `.length;
    return Math.max(40, 180 - PREFIX_SIZE - this.indent * 2);
  }

  static async start(
    opts: LoggerOptions,
    cb: (report: Logger) => Promise<void>,
  ): Promise<Logger> {
    const logger = new Logger(opts);

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
        applyStyle(`Edda ${EDDA_VERSION}`, Style.BOLD),
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

  startSection<T>(
    {reportHeader, reportFooter, skipIfEmpty}: SectionOptions,
    cb: () => T,
  ): T {
    const mark = {committed: false, action: () => reportHeader?.()};

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

  async startSectionAsync<T>(
    {reportHeader, reportFooter, skipIfEmpty}: SectionOptions,
    cb: () => Promise<T>,
  ): Promise<T> {
    const mark = {committed: false, action: () => reportHeader?.()};

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

        const completedMessage =
          elapsedTime > 200
            ? `└ Completed in ${pretty(elapsedTime, Type.DURATION)}`
            : "└ Completed";
        this.reportInfo(null, completedMessage);

        this.level -= 1;
      },
      skipIfEmpty: realOpts.skipIfEmpty,
    } as SectionOptions & {cb: Callback};
  }

  startTimer<T>(what: string, opts: TimerOptions, cb: () => T): T;
  startTimer<T>(what: string, cb: () => T): T;
  startTimer<T>(what: string, opts: TimerOptions | (() => T), cb?: () => T) {
    const {cb: realCb, ...sectionOps} = this.startTimerImpl(what, opts, cb);
    return this.startSection(sectionOps, realCb);
  }

  async startTimerAsync<T>(
    what: string,
    opts: TimerOptions,
    cb: () => Promise<T>,
  ): Promise<T>;
  async startTimerAsync<T>(what: string, cb: () => Promise<T>): Promise<T>;
  async startTimerAsync<T>(
    what: string,
    opts: TimerOptions | (() => Promise<T>),
    cb?: () => Promise<T>,
  ): Promise<T> {
    const {cb: realCb, ...sectionOps} = this.startTimerImpl(what, opts, cb);
    return this.startSectionAsync(sectionOps, realCb);
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

  reportProgress(progressIt: ProgressIterable) {
    if (progressIt.hasProgress && progressIt.hasTitle) {
      throw new Error(
        `Unimplemented: Progress bars can't have both progress and titles.`,
      );
    }

    let stopped = false;

    const stop = () => {
      if (stopped) {
        return;
      }

      stopped = true;

      this.progress.delete(progressIt);
      this.refreshProgress({delta: +1});
    };

    const promise = Promise.resolve().then(async () => {
      const progressDefinition: ProgressDefinition = {
        progress: progressIt.hasProgress ? 0 : undefined,
        title: progressIt.hasTitle ? `` : undefined,
      };

      this.progress.set(progressIt, {
        definition: progressDefinition,
        lastScaledSize: progressIt.hasProgress ? -1 : undefined,
        lastTitle: undefined,
      });

      this.refreshProgress({delta: -1});

      for await (const {progress, title} of progressIt) {
        if (stopped) {
          continue;
        }

        if (
          progressDefinition.progress === progress &&
          progressDefinition.title === title
        ) {
          continue;
        }

        progressDefinition.progress = progress;
        progressDefinition.title = title;

        this.refreshProgress();
      }

      stop();
    });

    return {...promise, stop};
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

  private clearProgress({
    delta = 0,
    clear = false,
  }: {
    delta?: number;
    clear?: boolean;
  }) {
    if (this.progressStyle === null) {
      return;
    }

    if (this.progress.size + delta > 0) {
      this.stdout.write(`\x1B[${this.progress.size + delta}A`);
      if (delta > 0 || clear) {
        this.stdout.write(`\x1B[0J`);
      }
    }
  }

  private writeProgress() {
    if (this.progressTimeout !== null) {
      clearTimeout(this.progressTimeout);
    }

    this.progressTimeout = null;

    if (this.progress.size === 0) {
      return;
    }

    const now = Date.now();

    if (now - this.progressTime > PROGRESS_INTERVAL) {
      this.progressFrame = (this.progressFrame + 1) % PROGRESS_FRAMES.length;
      this.progressTime = now;
    }

    const spinner = PROGRESS_FRAMES[this.progressFrame];

    for (const progress of this.progress.values()) {
      let progressBar = ``;

      if (typeof progress.lastScaledSize !== `undefined`) {
        const ok = this.progressStyle.chars[0].repeat(progress.lastScaledSize);
        const ko = this.progressStyle.chars[1].repeat(
          this.progressMaxScaledSize! - progress.lastScaledSize,
        );
        progressBar = ` ${ok}${ko}`;
      }

      const formattedName = formatName(null);
      const prefix = formattedName ? `${formattedName}: ` : ``;
      const title = progress.definition.title
        ? ` ${progress.definition.title}`
        : ``;

      this.stdout.write(
        `${pretty(`➤`, `blueBright`)} ${prefix}${spinner}${progressBar}${title}\n`,
      );
    }

    this.progressTimeout = setTimeout(() => {
      this.refreshProgress({force: true});
    }, PROGRESS_INTERVAL);
  }

  private refreshProgress({
    delta = 0,
    force = false,
  }: {delta?: number; force?: boolean} = {}) {
    let needsUpdate = false;
    let needsClear = false;

    if (force || this.progress.size === 0) {
      needsUpdate = true;
    } else {
      for (const progress of this.progress.values()) {
        const refreshedScaledSize =
          typeof progress.definition.progress !== `undefined`
            ? Math.trunc(
                this.progressMaxScaledSize! * progress.definition.progress,
              )
            : undefined;

        const previousScaledSize = progress.lastScaledSize;
        progress.lastScaledSize = refreshedScaledSize;

        const previousTitle = progress.lastTitle;
        progress.lastTitle = progress.definition.title;

        if (
          refreshedScaledSize !== previousScaledSize ||
          (needsClear = previousTitle !== progress.definition.title)
        ) {
          needsUpdate = true;
          break;
        }
      }
    }

    if (needsUpdate) {
      this.clearProgress({delta, clear: needsClear});
      this.writeProgress();
    }
  }

  static progressViaCounter(max: number) {
    let current = 0;

    let unlock: () => void;
    let lock = new Promise<void>((resolve) => {
      unlock = resolve;
    });

    const set = (n: number) => {
      const thisUnlock = unlock;

      lock = new Promise<void>((resolve) => {
        unlock = resolve;
      });

      current = n;
      thisUnlock();
    };

    const tick = () => {
      set(current + 1);
    };

    const gen = (async function* () {
      while (current < max) {
        await lock;
        yield {
          progress: current / max,
        };
      }
    })();

    return {
      [Symbol.asyncIterator]() {
        return gen;
      },
      hasProgress: true,
      hasTitle: false,
      set,
      tick,
    };
  }

  static progressViaTitle() {
    let currentTitle: string | undefined;

    let unlock: () => void;
    let lock = new Promise<void>((resolve) => {
      unlock = resolve;
    });

    const setTitle: (title: string) => void = throttle((title: string) => {
      const thisUnlock = unlock;

      lock = new Promise<void>((resolve) => {
        unlock = resolve;
      });

      currentTitle = title;
      thisUnlock();
    }, 1000 / TITLE_PROGRESS_FPS);

    const gen = (async function* () {
      while (true) {
        await lock;
        yield {
          title: currentTitle,
        };
      }
    })();

    return {
      [Symbol.asyncIterator]() {
        return gen;
      },
      hasProgress: false,
      hasTitle: true,
      setTitle,
    };
  }

  async startProgressAsync<T, P extends ProgressIterable>(
    progressIt: P,
    cb: (progressIt: P) => Promise<T>,
  ): Promise<T> {
    const reportedProgress = this.reportProgress(progressIt);

    try {
      return await cb(progressIt);
    } finally {
      reportedProgress.stop();
    }
  }

  startProgress<T, P extends ProgressIterable>(
    progressIt: P,
    cb: (progressIt: P) => T,
  ): T {
    const reportedProgress = this.reportProgress(progressIt);

    try {
      return cb(progressIt);
    } finally {
      reportedProgress.stop();
    }
  }

  reportInfoOnce(
    name: MessageName,
    text: string,
    opts?: {key?: any; reportExtra?: (logger: Logger) => void},
  ) {
    const key = opts && opts.key ? opts.key : text;

    if (!this.reportedInfos.has(key)) {
      this.reportedInfos.add(key);
      this.reportInfo(name, text);

      opts?.reportExtra?.(this);
    }
  }

  reportWarningOnce(
    name: MessageName,
    text: string,
    opts?: {key?: any; reportExtra?: (logger: Logger) => void},
  ) {
    const key = opts && opts.key ? opts.key : text;

    if (!this.reportedWarnings.has(key)) {
      this.reportedWarnings.add(key);
      this.reportWarning(name, text);

      opts?.reportExtra?.(this);
    }
  }

  reportErrorOnce(
    name: MessageName,
    text: string,
    opts?: {key?: any; reportExtra?: (logger: Logger) => void},
  ) {
    const key = opts && opts.key ? opts.key : text;

    if (!this.reportedErrors.has(key)) {
      this.reportedErrors.add(key);
      this.reportError(name, text);

      opts?.reportExtra?.(this);
    }
  }

  reportExceptionOnce(error: Error | ReportError) {
    if (isReportError(error)) {
      this.reportErrorOnce(error.reportCode, error.message, {key: error});
    } else {
      this.reportErrorOnce(
        MessageName.EXCEPTION,
        error.stack || error.message,
        {key: error},
      );
    }
  }

  private writeLine(str: string) {
    this.stdout.write(`${str}\n`);
  }

  private formatPrefix(prefix: string, caretColor: string) {
    return `${pretty("➤", caretColor)} ${prefix}${this.formatIndent()}`;
  }

  private formatIndent() {
    if (this.level > 0) {
      return "│ ".repeat(this.indent);
    }
    return `${SINGLE_LINE_CHAR} `;
  }
}
