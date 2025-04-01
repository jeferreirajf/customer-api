import { Customer } from '../entities/customer.entity';
import { Pagination } from '../shared/shared/types/pagination.dto';

export type PaginationData = {
  page?: number;
  perPage?: number;
  lastId?: string;
};

export abstract class CustomerRepository {
  abstract create(customer: Customer): Promise<void>;
  abstract findById(id: string): Promise<Customer | null>;
  abstract findAll(
    keyworkd: string,
    paginationData?: PaginationData,
  ): Promise<Pagination<Customer>>;
  abstract update(customer: Customer): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
