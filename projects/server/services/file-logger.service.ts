import { Logger } from './logger.service';

const log = require('electron-log');

export class FileLoggerService implements Logger {
  info(message: string) {
    log.info(message);
  }

  debug(message: string) {
    log.debug(message);
  }
}
