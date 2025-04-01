import { Customer } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { JestUtils } from '@/shared/utils/jest-utils';
import { NotFoundUsecaseException } from '@/usecase/exceptions/not-found-usecase.exception';
import { CustomerRepositoryMock } from '../_mocks/customer-repository.mock';
import {
  DeleteCustomerInput,
  DeleteCustomerUsecase,
} from './delete-customer.usecase';

describe('DeleteCustomerUsecase', () => {
  let customerRepositoryMock: CustomerRepository;

  beforeEach(() => {
    customerRepositoryMock = CustomerRepositoryMock.generate();
  });

  describe('execute', () => {
    it('should delete a customer when the customer exists', async () => {
      const customer = Customer.createIndividualCustomer({
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678901',
      });

      customerRepositoryMock =
        CustomerRepositoryMock.generateWithFindById(customer);

      const deleteCustomerUsecase = new DeleteCustomerUsecase(
        customerRepositoryMock,
      );

      const input: DeleteCustomerInput = { id: customer.getId() };

      await deleteCustomerUsecase.execute(input);

      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.findById).toHaveBeenCalledWith(
        customer.getId(),
      );
      expect(customerRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.delete).toHaveBeenCalledWith(
        customer.getId(),
      );
    });

    it('should throw an error when the customer does not exist', async () => {
      customerRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      const deleteCustomerUsecase = new DeleteCustomerUsecase(
        customerRepositoryMock,
      );

      const input: DeleteCustomerInput = {
        id: 'non-existent-customer-id',
      };

      const execute = async () => {
        await deleteCustomerUsecase.execute(input);
      };

      await JestUtils.expectErrorAsync(
        execute,
        NotFoundUsecaseException,
        `Customer with id non-existent-customer-id not found while DeleteCustomerUsecase.`,
      );

      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.findById).toHaveBeenCalledWith(
        'non-existent-customer-id',
      );
      expect(customerRepositoryMock.delete).not.toHaveBeenCalled();
    });
  });
});
