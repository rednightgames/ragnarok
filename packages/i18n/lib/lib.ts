import {Cli, UsageError} from "clipanion";
import {resolve} from "path";

import {CommandContext} from "./types";
import {HelpCommand, VersionCommand} from "./commands";

export type EddaCli = ReturnType<typeof getBaseCli>;

const getBaseCli = (cwd: string) => {
  const cli = new Cli<CommandContext>({
    binaryLabel: `Edda cli to extract/validate translations`,
    binaryName: `i18n`,
    binaryVersion: EDDA_VERSION ?? `<unknown>`,
  });

  cli.register(HelpCommand);
  cli.register(VersionCommand);

  return Object.assign(cli, {
    defaultContext: {
      ...Cli.defaultContext,
      cwd,
      quiet: false,
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
    },
  });
};

const validateNodejsVersion = (cli: EddaCli) => {
  const version = process.versions.node;

  // Non-exhaustive known requirements:
  // - 18.12 is the first LTS release
  const range = `>=18.12.0`;

  const error = new UsageError(`This tool requires a Node version compatible with ${range} (got ${version}). Upgrade Node.`);
  Cli.defaultContext.stdout.write(cli.error(error));

  return false;
};

const checkCwd = (cli: EddaCli, argv: string[]) => {
  let cwd: string | null = null;

  let postCwdArgv = argv;
  if (argv.length >= 2 && argv[0] === `--cwd`) {
    cwd = argv[1];
    postCwdArgv = argv.slice(2);
  } else if (argv.length >= 1 && argv[0].startsWith(`--cwd=`)) {
    cwd = argv[0].slice(6);
    postCwdArgv = argv.slice(1);
  } else if (argv[0] === `add` && argv[argv.length - 2] === `--cwd`) {
    cwd = argv[argv.length - 1];
    postCwdArgv = argv.slice(0, argv.length - 2);
  }

  cli.defaultContext.cwd = cwd !== null
    ? resolve(cwd)
    : process.cwd();

  return postCwdArgv;
};

const run = async (cli: EddaCli, argv: string[]) => {
  const postCwdArgv = checkCwd(cli, argv);

  const command = cli.process(postCwdArgv, cli.defaultContext);

  return cli.run(command, cli.defaultContext);
};

export const runExit = async (argv: string[], {cwd = process.cwd()}: {cwd: string}) => {
  const cli = getBaseCli(cwd);

  try {
    process.exitCode = await run(cli, argv);
  } catch (error) {
    Cli.defaultContext.stdout.write(cli.error(error));
    process.exitCode = 1;
  }
};
