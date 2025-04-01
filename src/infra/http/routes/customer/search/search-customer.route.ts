import {
  SearchCustomerInput,
  SearchCustomerUsecase,
} from '@/usecase/customer/search/search-customer.usecase';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  SearchCustomerFilters,
  SearchCustomerResponse,
} from './search-customer.dto';
import { SearchCustomerPresenter } from './search-customer.presenter';

@Controller('customers')
export class SearchCustomerRoute {
  public constructor(
    private readonly searchCustomerUsecase: SearchCustomerUsecase,
  ) {}

  @ApiOperation({
    summary: 'Search customers',
    description: 'Search customers by keyword, lastId, page and size',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SearchCustomerResponse,
    description: 'Customers found successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid search parameters',
  })
  @Get()
  public async handler(
    @Query() filters: SearchCustomerFilters,
  ): Promise<SearchCustomerResponse> {
    const input: SearchCustomerInput = {
      keyword: filters.keyword,
      lastId: filters.lastId,
      page: filters.page,
      perPage: filters.size,
    };

    const result = await this.searchCustomerUsecase.execute(input);

    const response = SearchCustomerPresenter.toHttp(result);

    return response;
  }
}
