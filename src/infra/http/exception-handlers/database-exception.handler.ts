import { DatabaseException } from '@/infra/database/exceptions/database.exception';
import { LoggerNestjs } from '@/infra/log/nestjs-logger/logger.nestjs';
import { Exception } from '@/shared/exceptions/exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GetRequestIdNestjsService } from '../services/nestjs/get-request-id.nestjs.service';
import { HttpResponseError } from '../utils/http-response-error';

@Catch(DatabaseException)
export class DatabaseExceptionHandler implements ExceptionFilter {
  public constructor() {}

  public catch(exception: DatabaseException, host: ArgumentsHost): void {
    this.logError(exception, host);

    const response = host.switchToHttp().getResponse();

    const statusCode = HttpStatus.BAD_REQUEST;

    const aResponse = HttpResponseError.create({
      message: `Houve um erro com o banco de dados. ${exception.message}`,
      statusCode,
    });

    response.status(statusCode).json(aResponse);
  }

  private logError(exception: Exception, host: ArgumentsHost): void {
    const request = host.switchToHttp().getRequest();
    const getRequestIdService = new GetRequestIdNestjsService(request);
    const logger = new LoggerNestjs(getRequestIdService);
    logger.error(exception);
  }
}

export const DatabaseExceptionHandlerProvider = {
  provide: APP_FILTER,
  useClass: DatabaseExceptionHandler,
};
