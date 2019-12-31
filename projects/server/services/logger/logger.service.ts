import { Loggable } from './loggable';

export interface Logger {

  /**
   * Log an information message
   * @param message The message to log
   */
  info(issuer: Loggable | string, message: string);

  /**
   * Log a debug message
   * @param message The message to log
   */
  debug(issuer: Loggable | string, message: string);

  /**
   * Log a warning message
   * @param issuer The message issuer
   * @param message The message to log
   */
  warn(issuer: Loggable | string, message: string);

  /**
   * Log an error message
   * @param issuer The message issuer
   * @param message The message to log
   */
  error(issuer: Loggable | string, message: string);
}
