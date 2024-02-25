import {BaseCommand} from "./base";

export default class HelpCommand extends BaseCommand {
  static paths = [
    [`help`],
    [`--help`],
    [`-h`],
  ];

  async execute() {
    this.context.stdout.write(this.cli.usage(null));
  }
}
