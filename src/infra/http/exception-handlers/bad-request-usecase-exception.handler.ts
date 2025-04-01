import { LoggerNestjs } from '@/infra/log/nestjs-logger/logger.nestjs';
import { Exception } from '@/shared/exceptions/exception';
import { BadRequestUsecaseException } from '@/usecase/exceptions/bad-request-usecase.exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GetRequestIdNestjsService } from '../services/nestjs/get-request-id.nestjs.service';
import { HttpResponseError } from '../utils/http-response-error';

@Catch(BadRequestUsecaseException)
export class BadRequestUsecaseExceptionHandler implements ExceptionFilter {
  public constructor() {}

  public catch(
    exception: BadRequestUsecaseException,
    host: ArgumentsHost,
  ): void {
    this.logError(exception, host);

    const response = host.switchToHttp().getResponse();

    const statusCode = HttpStatus.BAD_REQUEST;

    const aResponse = HttpResponseError.create({
      message: `Houve um erro na sua requisição. ${exception.message}`,
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

export const BadRequestUsecaseExceptionHandlerProvider = {
  provide: APP_FILTER,
  useClass: BadRequestUsecaseExceptionHandler,
};
