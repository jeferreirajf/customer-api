import { CreateCustomerUsecase } from '@/usecase/customer/create/create-customer.usecase';
import { DeleteCustomerUsecase } from '@/usecase/customer/delete/delete-customer.usecase';
import { FindByIdCustomerUsecase } from '@/usecase/customer/find-by-id/find-by-id-customer.usecase';
import { SearchCustomerUsecase } from '@/usecase/customer/search/search-customer.usecase';
import { UpdateCustomerUsecase } from '@/usecase/customer/update/update-customer.usecase';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerProvider } from '../log/nestjs-logger/logger.nestjs';
import { BadRequestUsecaseExceptionHandlerProvider } from './exception-handlers/bad-request-usecase-exception.handler';
import { DatabaseExceptionHandlerProvider } from './exception-handlers/database-exception.handler';
import { DomainExceptionHandlerProvider } from './exception-handlers/domain-exception.handler';
import { NotFoundUsecaseExceptionHandlerProvider } from './exception-handlers/not-found-usecase-exception.handler';
import { UsecaseExceptionHandlerProvider } from './exception-handlers/usecase-exception.handler';
import { ValidationDomainExceptionHandlerProvider } from './exception-handlers/validation-domain-exception.handler';
import { InjectRequestIdMiddleware } from './middlewares/inject-request-id.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CreateCustomerRoute } from './routes/customer/create/create-customer.route';
import { DeleteCustomerRoute } from './routes/customer/delete/delete-customer.route';
import { FindCustomerRoute } from './routes/customer/find/find-customer.route';
import { SearchCustomerRoute } from './routes/customer/search/search-customer.route';
import { UpdateCustomerRoute } from './routes/customer/update/update-customer.route';
import { GetRequestIdServiceProvider } from './services/nestjs/get-request-id.nestjs.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateCustomerUsecase,
    DeleteCustomerUsecase,
    FindByIdCustomerUsecase,
    UpdateCustomerUsecase,
    SearchCustomerUsecase,
    GetRequestIdServiceProvider,
    LoggerProvider,
    DomainExceptionHandlerProvider,
    ValidationDomainExceptionHandlerProvider,
    UsecaseExceptionHandlerProvider,
    BadRequestUsecaseExceptionHandlerProvider,
    DatabaseExceptionHandlerProvider,
    NotFoundUsecaseExceptionHandlerProvider,
  ],
  exports: [],
  controllers: [
    CreateCustomerRoute,
    DeleteCustomerRoute,
    FindCustomerRoute,
    UpdateCustomerRoute,
    SearchCustomerRoute,
  ],
})
export class HttpModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(InjectRequestIdMiddleware)
      .forRoutes('*');
  }
}
