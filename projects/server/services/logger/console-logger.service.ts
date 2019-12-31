import { Loggable } from './loggable';
import { LoggerBase } from './logger-base';
import { Logger } from './logger.service';

export class ConsoleLoggerService extends LoggerBase implements Logger {

  /**
   * Log an information message
   * @param message The message to log
   */
  public info(issuer: Loggable | string, message: string) {
    console.log(this.formatMessage(issuer, message));
  }

  /**
   * Log a debug message
   * @param message The message to log
   */
  public debug(issuer: Loggable | string, message: string) {
    console.log(this.formatMessage(issuer, message));
  }
}
