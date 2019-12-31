import { Loggable } from './loggable';

export abstract class LoggerBase {
  /**
   * Get the issuer name
   * @param issuer The issuer where to retrive name
   */
  protected getIssuerName(issuer: Loggable | string): string {
    if (this.isLoggable(issuer)) {
      return issuer.tag;
    }

    return issuer;
  }

  /**
   * Check if the issue is a string or a ILoggable
   * @param issuer The current issue of the message
   */
  private isLoggable(issuer: Loggable | string): issuer is Loggable {
    if (typeof issuer === 'string') {
      return false;
    }

    return true;
  }

  /**
   * Format the message output
   * @param issuer The issue
   * @param message The message
   */
  protected formatMessage(issuer: Loggable | string, message: string): string {
    return `[${this.getIssuerName(issuer)}] ${message}`;
  }
}
