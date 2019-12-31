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
  debug(issuer: Loggable | string, message: string) {
    log.debug(this.formatMessage(issuer, message));
  }
}
