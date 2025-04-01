import { Exception } from '@/shared/exceptions/exception';

/**
 * Logger
 *
 * @description
 * This class is responsible for logging errors and messages.
 * These methods could be used to send logs to a ElasticSearch or any other logging service.
 * */
export abstract class Logger {
  public abstract error(error: Exception): void;
  public abstract log(message: string, context?: string): void;
}
