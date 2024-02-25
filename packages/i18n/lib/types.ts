import {Readable, Writable} from "stream";


export type CommandContext = {
  cwd: string;
  env: Record<string, string | undefined>;
  quiet: boolean;
  stdin: Readable;
  stdout: Writable;
  stderr: Writable;
  colorDepth: number;
};
