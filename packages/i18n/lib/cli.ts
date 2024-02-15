import {is} from "./helpers";

export class Cli {
  private argv: string[];

  constructor(argv: string[]) {
    this.argv = argv.slice(2);
  }

  public async run() {
    const [, ...options] = this.argv;

    if (is("extract")) {
      await this.extract(options[0]);
    }

    if (is("validate")) {
      const flags = { isVerbose: options.includes("--verbose") };
      const args = options.filter((val) => !val.startsWith("--"));

      await this.validate(args[1], flags);
    }

    process.exit(0);
  }

  async extract(app = "app") {

  }
  
  async validate(dir: string, flags: {isVerbose: boolean}) {

  }
}