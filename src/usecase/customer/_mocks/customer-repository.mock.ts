import { Customer } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { Pagination } from '@/domain/shared/shared/types/pagination.dto';

export class CustomerRepositoryMock {
  public static generate(): CustomerRepository {
    const aMock: CustomerRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    } as unknown as CustomerRepository;

    return aMock;
  }

  public static generateWithFindById(customer: Customer): CustomerRepository {
    const aMock = this.generate();

    aMock.findById = jest.fn().mockResolvedValue(customer);

    return aMock;
  }

  public static generateWithFindAll(
    customers: Customer[],
    total?: number,
    currentPage?: number,
    perPage?: number,
    next?: number,
    prev?: number,
  ): CustomerRepository {
    const aMock = this.generate();

    const paginatedCustomers: Pagination<Customer> = {
      items: customers,
      total: total || customers.length * 10,
      perPage: perPage || customers.length,
      currentPage: currentPage || 2,
      next: next || 3,
      prev: prev || 1,
      lastId: customers[customers.length - 1]?.getId() ?? null,
    };

    aMock.findAll = jest.fn().mockResolvedValue(paginatedCustomers);

    return aMock;
  }
}
