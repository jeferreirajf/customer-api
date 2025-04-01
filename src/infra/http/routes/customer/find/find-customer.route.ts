import {
  FindByIdCustomerUsecase,
  FindByIdCustomerUsecaseInput,
} from '@/usecase/customer/find-by-id/find-by-id-customer.usecase';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { FindCustomerPresenter } from './find-customer.presenter';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindCustomerResponse } from './find-customer.dto';

@Controller('customers')
export class FindCustomerRoute {
  public constructor(
    private readonly findCustomerUsecase: FindByIdCustomerUsecase,
  ) {}

  @ApiOperation({
    summary: 'Find a customer by ID',
    description: 'Find a customer by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FindCustomerResponse,
    description: 'Customer found successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @Get(':customerId')
  public async handler(@Param('customerId') customerId: string) {
    const input: FindByIdCustomerUsecaseInput = {
      id: customerId,
    };

    const result = await this.findCustomerUsecase.execute(input);

    const response = FindCustomerPresenter.toHttp(result);

    return response;
  }
}
