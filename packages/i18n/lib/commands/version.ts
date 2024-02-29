import {BaseCommand} from "./base";

export default class VersionCommand extends BaseCommand {
  static paths = [
    [`-v`],
    [`--version`],
  ];

  async execute() {
    this.context.stdout.write(`${EDDA_VERSION || `<unknown>`}\n`);
  }
}
