import {
  CreateCustomerInput,
  CreateCustomerUsecase,
} from '@/usecase/customer/create/create-customer.usecase';
import { Controller, Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateCustomerRequest,
  CreateCustomerResponse,
} from './create-customer.dto';
import { CreateCustomerPresenter } from './create-customer.presenter';

@Controller('customers')
export class CreateCustomerRoute {
  public constructor(
    private readonly createCustomerUsecase: CreateCustomerUsecase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new customer',
    description: 'Create a new customer',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateCustomerResponse,
    description: 'Customer created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid customer data',
  })
  public async handler(
    @Body() request: CreateCustomerRequest,
  ): Promise<CreateCustomerResponse> {
    const input: CreateCustomerInput = {
      name: request.name,
      email: request.email,
      document: request.document,
      customerType: request.customerType,
    };

    const result = await this.createCustomerUsecase.execute(input);

    const response = CreateCustomerPresenter.toHttp(result);

    return response;
  }
}
