export class ConsoleLoggerService {
  public info(message: string) {
    console.log(message);
  }

  public debug(message: string) {
    console.log(message);
  }
}

export interface Logger {
  info(message: string);

  debug(message: string);
}
