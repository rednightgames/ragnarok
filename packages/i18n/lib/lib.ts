export const runExit = async (argv: Array<string>, {cwd = process.cwd()}: {cwd: string}) => {
  console.log(cwd);
}
