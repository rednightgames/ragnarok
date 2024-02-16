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

    process.exit(0);
  }

  async extract(app = "app") {

  }
}
