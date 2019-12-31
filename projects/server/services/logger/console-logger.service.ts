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

  /**
   * Log a warning message
   * @param issuer The message's issuer
   * @param message The message to log
   */
  public warn(issuer: string | Loggable, message: string) {
    console.warn(this.formatMessage(issuer, message));
  }

  /**
   * Log an error message
   * @param issuer The message's issuer
   * @param message The message to log
   */
  public error(issuer: string | Loggable, message: string) {
    console.error(this.formatMessage(issuer, message));
  }
}
