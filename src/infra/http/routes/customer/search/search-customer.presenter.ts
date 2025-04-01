import { SearchCustomerOutput } from '@/usecase/customer/search/search-customer.usecase';
import { CustomerDto, SearchCustomerResponse } from './search-customer.dto';

export class SearchCustomerPresenter {
  public static toHttp(input: SearchCustomerOutput): SearchCustomerResponse {
    const items: CustomerDto[] = input.result.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      document: item.document,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    const output: SearchCustomerResponse = {
      items,
      total: input.total,
      page: input.page,
      size: input.perPage,
      next: input.next,
      prev: input.prev,
      lastId: input.lastId,
    };

    return output;
  }
}
