import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { CustomerRepositoryMock } from '../_mocks/customer-repository.mock';
import {
  FindByIdCustomerUsecase,
  FindByIdCustomerUsecaseInput,
  FindByIdCustomerUsecaseOutput,
} from './find-by-id-customer.usecase';
import { JestUtils } from '@/shared/utils/jest-utils';
import { Customer } from '@/domain/entities/customer.entity';
import { NotFoundUsecaseException } from '@/usecase/exceptions/not-found-usecase.exception';

describe('FindByIdCustomerUsecase', () => {
  let customerRepositoryMock: CustomerRepository;

  beforeEach(() => {
    customerRepositoryMock = CustomerRepositoryMock.generate();
  });

  describe('execute', () => {
    it('should return a customer when the customer exists', async () => {
      const customer = Customer.createIndividualCustomer({
        name: 'Jane Doe',
        email: 'jane@doe.com',
        document: '98765432100',
      });

      customerRepositoryMock =
        CustomerRepositoryMock.generateWithFindById(customer);

      const findByIdCustomerUsecase = new FindByIdCustomerUsecase(
        customerRepositoryMock,
      );

      const input: FindByIdCustomerUsecaseInput = { id: customer.getId() };

      const output: FindByIdCustomerUsecaseOutput =
        await findByIdCustomerUsecase.execute(input);

      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.findById).toHaveBeenCalledWith(
        customer.getId(),
      );
      expect(output).toEqual({
        id: customer.getId(),
        name: customer.getName(),
        email: customer.getEmail(),
        document: customer.getDocument().getDocument(),
        createdAt: customer.getCreatedAt(),
        updatedAt: customer.getUpdatedAt(),
      });
    });

    it('should throw an error when the customer does not exist', async () => {
      customerRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      const findByIdCustomerUsecase = new FindByIdCustomerUsecase(
        customerRepositoryMock,
      );

      const input: FindByIdCustomerUsecaseInput = {
        id: 'non-existent-customer-id',
      };

      const execute = async () => {
        await findByIdCustomerUsecase.execute(input);
      };

      await JestUtils.expectErrorAsync(
        execute,
        NotFoundUsecaseException,
        `Customer with id non-existent-customer-id not found while FindByIdCustomerUsecase.`,
      );

      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.findById).toHaveBeenCalledWith(
        'non-existent-customer-id',
      );
    });
  });
});
