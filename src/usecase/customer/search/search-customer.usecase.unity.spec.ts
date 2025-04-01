import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { CustomerRepositoryMock } from '../_mocks/customer-repository.mock';
import {
  SearchCustomerUsecase,
  SearchCustomerInput,
  SearchCustomerOutput,
} from './search-customer.usecase';
import { Customer } from '@/domain/entities/customer.entity';

describe('SearchCustomerUsecase', () => {
  let customerRepositoryMock: CustomerRepository;

  beforeEach(() => {
    customerRepositoryMock = CustomerRepositoryMock.generate();
  });

  describe('execute', () => {
    it('should return a paginated list of customers when customers are found', async () => {
      const customers = [
        Customer.createIndividualCustomer({
          name: 'John Doe',
          email: 'john@doe.com',
          document: '12345678900',
        }),
        Customer.createIndividualCustomer({
          name: 'Jane Doe',
          email: 'jane@doe.com',
          document: '98765432100',
        }),
      ];

      customerRepositoryMock = CustomerRepositoryMock.generateWithFindAll(
        customers,
        2,
        1,
      );

      const searchCustomerUsecase = new SearchCustomerUsecase(
        customerRepositoryMock,
      );

      const input: SearchCustomerInput = {
        keyword: 'Doe',
        page: 1,
        perPage: 2,
      };

      const output: SearchCustomerOutput =
        await searchCustomerUsecase.execute(input);

      expect(customerRepositoryMock.findAll).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.findAll).toHaveBeenCalledWith('Doe', {
        page: 1,
        perPage: 2,
      });

      expect(output).toEqual({
        result: customers.map((customer) => ({
          id: customer.getId(),
          name: customer.getName(),
          email: customer.getEmail(),
          document: customer.getDocument().getDocument(),
          createdAt: customer.getCreatedAt(),
          updatedAt: customer.getUpdatedAt(),
        })),
        total: 2,
        page: 1,
        perPage: 2,
        next: 3,
        prev: 1,
        lastId: expect.any(String),
      });
    });

    it('should return an empty list when no customers are found', async () => {
      customerRepositoryMock = CustomerRepositoryMock.generateWithFindAll(
        [],
        0,
        1,
        10,
      );

      const searchCustomerUsecase = new SearchCustomerUsecase(
        customerRepositoryMock,
      );

      const input: SearchCustomerInput = {
        keyword: 'NonExistent',
        page: 1,
        perPage: 10,
      };

      const output: SearchCustomerOutput =
        await searchCustomerUsecase.execute(input);

      expect(customerRepositoryMock.findAll).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.findAll).toHaveBeenCalledWith(
        'NonExistent',
        { page: 1, perPage: 10 },
      );
      expect(output).toEqual({
        result: [],
        total: 0,
        page: 1,
        perPage: 10,
        next: 3,
        prev: 1,
        lastId: null,
      });
    });
  });
});
