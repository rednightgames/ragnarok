import {BaseContext, Cli, UsageError} from "clipanion";
import {resolve} from "path";

import {ExtractCommand, HelpCommand, VersionCommand} from "./commands";
import {satisfiesWithPrereleases} from "./helpers";

export type EddaCli = ReturnType<typeof getBaseCli>;

export interface CliContext extends BaseContext {
  cwd: string,
}

const getBaseCli = (cwd: string) => {
  const cli = new Cli<CliContext>({
    binaryLabel: `Edda cli to extract/validate translations`,
    binaryName: `i18n`,
    binaryVersion: EDDA_VERSION ?? `<unknown>`,
  });

  cli.register(ExtractCommand);
  cli.register(HelpCommand);
  cli.register(VersionCommand);

  return Object.assign(cli, {
    defaultContext: {
      ...Cli.defaultContext,
      cwd,
    },
  });
};

const validateNodejsVersion = (cli: EddaCli) => {
  const version = process.versions.node;

  // Non-exhaustive known requirements:
  // - 18.12 is the first LTS release
  const range = `>=18.12.0`;

  if (satisfiesWithPrereleases(version, range)) {
    return true;
  }

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
  if (!validateNodejsVersion(cli)) {
return 1;
}

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
