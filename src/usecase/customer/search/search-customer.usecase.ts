import { Customer } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { Pagination } from '@/domain/shared/shared/types/pagination.dto';
import { Usecase } from '@/usecase/usecase';
import { Injectable } from '@nestjs/common';

export type SearchCustomerInput = {
  keyword: string;
  page?: number;
  perPage?: number;
  lastId?: string;
};

export type CustomerDto = {
  id: string;
  name: string;
  email: string;
  document: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SearchCustomerOutput = {
  result: CustomerDto[];
  total: number;
  page: number;
  perPage: number;
  next: number | null;
  prev: number | null;
  lastId: string | null;
};

@Injectable()
export class SearchCustomerUsecase
  implements Usecase<SearchCustomerInput, SearchCustomerOutput>
{
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(
    input: SearchCustomerInput,
  ): Promise<SearchCustomerOutput> {
    const keyword = input.keyword;
    const page = input.page ?? 1;
    const perPage = input.perPage ?? 10;

    const result = await this.customerRepository.findAll(keyword, {
      page,
      perPage,
      lastId: input.lastId,
    });

    const output = this.toOutput(result, page);

    return output;
  }

  private toOutput(
    result: Pagination<Customer>,
    page: number,
  ): SearchCustomerOutput {
    const customers: CustomerDto[] = result.items.map((customer) => ({
      id: customer.getId(),
      name: customer.getName(),
      email: customer.getEmail(),
      document: customer.getDocument().getDocument(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    }));

    const output: SearchCustomerOutput = {
      result: customers,
      total: result.total,
      perPage: result.perPage,
      page: page,
      next: result.next,
      prev: result.prev,
      lastId: result.lastId,
    };

    return output;
  }
}
