export interface Logger {

  /**
   * Log an information message
   * @param message The message to log
   */
  info(message: string);

  /**
   * Log a debug message
   * @param message The message to log
   */
  debug(message: string);
}
