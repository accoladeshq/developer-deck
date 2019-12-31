import { Logger } from './logger.service';
import { LoggerBase } from './logger-base';
import { Loggable } from './loggable';

const log = require('electron-log');

export class FileLoggerService extends LoggerBase implements Logger {
  /**
   * Log an information message
   * @param message The message to log
   */
  public info(issuer: Loggable | string, message: string) {
    log.info(this.formatMessage(issuer, message));
  }

  /**
   * Log a debug message
   * @param message The message to log
   */
  public debug(issuer: Loggable | string, message: string) {
    log.debug(this.formatMessage(issuer, message));
  }

  /**
   * Log a warning message
   * @param issuer The message's issuer
   * @param message The message to log
   */
  public warn(issuer: string | Loggable, message: string) {
    log.warn(this.formatMessage(issuer, message));
  }

  /**
   * Log an error message
   * @param issuer The message's issuer
   * @param message The message to log
   */
  public error(issuer: string | Loggable, message: string) {
    log.error(this.formatMessage(issuer, message));
  }
}
