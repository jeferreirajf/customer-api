import { LoggerNestjs } from '@/infra/log/nestjs-logger/logger.nestjs';
import { NotFoundUsecaseException } from '@/usecase/exceptions/not-found-usecase.exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GetRequestIdNestjsService } from '../services/nestjs/get-request-id.nestjs.service';
import { HttpResponseError } from '../utils/http-response-error';
import { Exception } from '@/shared/exceptions/exception';

@Catch(NotFoundUsecaseException)
export class NotFoundUsecaseExceptionHandler implements ExceptionFilter {
  public constructor() {}

  public async catch(
    exception: NotFoundUsecaseException,
    host: ArgumentsHost,
  ): Promise<void> {
    this.logError(exception, host);

    const response = host.switchToHttp().getResponse();

    const statusCode = HttpStatus.NOT_FOUND;

    const aResponse = HttpResponseError.create({
      message: `O recurso que você tentou acessar não foi encontrado. ${exception.message}`,
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

export const NotFoundUsecaseExceptionHandlerProvider = {
  provide: APP_FILTER,
  useClass: NotFoundUsecaseExceptionHandler,
};
