import {
  UpdateCustomerInput,
  UpdateCustomerUsecase,
} from '@/usecase/customer/update/update-customer.usecase';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  UpdateCustomerRequest,
  UpdateCustomerResponse,
} from './update-customer.dto';
import { UpdateCustomerPresenter } from './update-customer.presenter';

@Controller('customers')
export class UpdateCustomerRoute {
  public constructor(
    private readonly updateCustomerUsecase: UpdateCustomerUsecase,
  ) {}

  @Put(':customerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existent customer',
    description: 'Update an existent customer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateCustomerResponse,
    description: 'Customer ',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid customer data',
  })
  public async handler(
    @Param('customerId') customerId: string,
    @Body() request: UpdateCustomerRequest,
  ): Promise<UpdateCustomerResponse> {
    const input: UpdateCustomerInput = {
      id: customerId,
      name: request.name,
      email: request.email,
      document: request.document,
      customerType: request.customerType,
    };

    const result = await this.updateCustomerUsecase.execute(input);

    const response = UpdateCustomerPresenter.toHttp(result);

    return response;
  }
}
