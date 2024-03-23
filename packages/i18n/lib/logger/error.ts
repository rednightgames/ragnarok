import {MessageName} from "./messageNames";

export class ReportError extends Error {
  public reportCode: MessageName;
  public originalError?: Error;

  constructor(code: MessageName, message: string) {
    super(message);

    this.reportCode = code;
  }
}
