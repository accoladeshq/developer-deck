import { Logger } from './logger.service';

const log = require('electron-log');

export class FileLoggerService implements Logger {
  /**
   * Log an information message
   * @param message The message to log
   */
  info(message: string) {
    log.info(message);
  }

  /**
   * Log a debug message
   * @param message The message to log
   */
  debug(message: string) {
    log.debug(message);
  }
}
