import {
  ConsoleLogger,
  Injectable,
  Logger as NestLogger,
  Scope,
} from '@nestjs/common';
import { Logger } from '../logger';
import { GetRequestIdService } from '@/infra/http/services/get-request-id.service';
import { Exception } from '@/shared/exceptions/exception';

/**
 * LoggerNestjs
 *
 * @description
 * This class is responsible for logging errors and messages using the NestJS Logger.
 * It extends the Logger class and implements the error and log methods.
 * It uses the GetRequestIdService to get the request ID for logging purposes.
 * It also provides a provider for dependency injection.
 * This class could be used to send logs to a ElasticSearch or any other logging service.
 *
 * @example
 * const logger = new LoggerNestjs(getRequestIdService);
 * logger.error(new Exception('Error message'));
 * logger.log('Log message');
 *
 * @param {GetRequestIdService} getRequestIdService - The service to get the request ID.
 * @returns {LoggerNestjs} - An instance of the LoggerNestjs class.
 * @throws {Error} - Throws an error if the getRequestIdService is not provided.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerNestjs extends Logger {
  public constructor(
    private readonly getRequestIdService: GetRequestIdService,
  ) {
    super();
  }

  public error(error: Exception): void {
    const requestId = this.getRequestIdService.getRequestId();
    const errorMessage = error?.message;
    const errorStack = error?.stack;
    const errorName = error?.name;
    const errorContext = error?.getContext() || LoggerNestjs.name;

    const logger = new NestLogger(errorContext);

    const errorLog = {
      request: requestId,
      error: errorName,
      message: errorMessage,
      stack: errorStack,
      context: errorContext,
    };

    logger.error({ errorLog }, errorContext);
  }

  public log(message: string, context?: string): void {
    const requestId = this.getRequestIdService.getRequestId();

    const loggerContext = context || LoggerNestjs.name;

    const logger = new ConsoleLogger(loggerContext);

    const logMessage = {
      request: requestId,
      message: message,
    };

    logger.log({ logMessage }, loggerContext);
  }
}

export const LoggerProvider = {
  provide: Logger,
  useClass: LoggerNestjs,
};
