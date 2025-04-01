import { LoggerNestjs } from '@/infra/log/nestjs-logger/logger.nestjs';
import { Exception } from '@/shared/exceptions/exception';
import { UsecaseException } from '@/usecase/exceptions/usecase.exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GetRequestIdNestjsService } from '../services/nestjs/get-request-id.nestjs.service';
import { HttpResponseError } from '../utils/http-response-error';

@Catch(UsecaseException)
export class UsecaseExceptionHandler implements ExceptionFilter {
  public constructor() {}

  public catch(exception: UsecaseException, host: ArgumentsHost): void {
    this.logError(exception, host);

    const response = host.switchToHttp().getResponse();

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const aResponse = HttpResponseError.create({
      message: `Houve um erro interno inesperado.`,
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

export const UsecaseExceptionHandlerProvider = {
  provide: APP_FILTER,
  useClass: UsecaseExceptionHandler,
};
