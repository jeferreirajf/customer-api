import {
  DeleteCustomerInput,
  DeleteCustomerUsecase,
} from '@/usecase/customer/delete/delete-customer.usecase';
import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('customers')
export class DeleteCustomerRoute {
  public constructor(
    private readonly deleteCustomerUsecase: DeleteCustomerUsecase,
  ) {}

  @ApiOperation({
    summary: 'Delete a customer',
    description: 'Delete a customer by ID',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Customer deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @Delete(':customerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async handler(@Param('customerId') customerId: string): Promise<void> {
    const input: DeleteCustomerInput = {
      id: customerId,
    };

    await this.deleteCustomerUsecase.execute(input);
  }
}
