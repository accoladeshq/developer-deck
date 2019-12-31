export class ConsoleLoggerService {

  /**
   * Log an information message
   * @param message The message to log
   */
  public info(message: string) {
    console.log(message);
  }

  /**
   * Log a debug message
   * @param message The message to log
   */
  public debug(message: string) {
    console.log(message);
  }
}
