import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { CustomerRepositoryMock } from '../_mocks/customer-repository.mock';
import {
  UpdateCustomerUsecase,
  UpdateCustomerInput,
  UpdateCustomerOutput,
} from './update-customer.usecase';
import { JestUtils } from '@/shared/utils/jest-utils';
import { Customer } from '@/domain/entities/customer.entity';
import { CustomerType } from '../create/create-customer.usecase';
import { DocumentType } from '@/domain/value-objects/document.value-object';
import { NotFoundUsecaseException } from '@/usecase/exceptions/not-found-usecase.exception';

describe('UpdateCustomerUsecase', () => {
  let customerRepositoryMock: CustomerRepository;

  beforeEach(() => {
    customerRepositoryMock = CustomerRepositoryMock.generate();
  });

  describe('execute', () => {
    it('should update a customer successfully while customer type is LEGAL', async () => {
      const customer = Customer.createIndividualCustomer({
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678900',
      });

      customerRepositoryMock =
        CustomerRepositoryMock.generateWithFindById(customer);

      const updateCustomerUsecase = new UpdateCustomerUsecase(
        customerRepositoryMock,
      );

      const input: UpdateCustomerInput = {
        id: customer.getId(),
        name: 'John Updated',
        email: 'john.updated@doe.com',
        document: '12345678901234',
        customerType: CustomerType.LEGAL,
      };

      const output: UpdateCustomerOutput =
        await updateCustomerUsecase.execute(input);

      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.findById).toHaveBeenCalledWith(
        customer.getId(),
      );
      expect(customerRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.update).toHaveBeenCalledWith(customer);
      expect(output).toEqual({ id: customer.getId() });
      expect(customer.getName()).toBe(input.name);
      expect(customer.getEmail()).toBe(input.email);
      expect(customer.getDocument().getDocument()).toBe(input.document);
      expect(customer.getDocument().getType()).toBe(DocumentType.CNPJ);
    });

    it('should update a customer successfully while customer type is INDIVIDUAL', async () => {
      const customer = Customer.createLegalCustomer({
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678901234',
      });

      customerRepositoryMock =
        CustomerRepositoryMock.generateWithFindById(customer);

      const updateCustomerUsecase = new UpdateCustomerUsecase(
        customerRepositoryMock,
      );

      const input: UpdateCustomerInput = {
        id: customer.getId(),
        name: 'John Updated',
        email: 'john.updated@doe.com',
        document: '12345678901',
        customerType: CustomerType.INDIVIDUAL,
      };

      const output: UpdateCustomerOutput =
        await updateCustomerUsecase.execute(input);

      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.findById).toHaveBeenCalledWith(
        customer.getId(),
      );
      expect(customerRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.update).toHaveBeenCalledWith(customer);
      expect(output).toEqual({ id: customer.getId() });
      expect(customer.getName()).toBe(input.name);
      expect(customer.getEmail()).toBe(input.email);
      expect(customer.getDocument().getDocument()).toBe(input.document);
      expect(customer.getDocument().getType()).toBe(DocumentType.CPF);
    });

    it('should throw an error when the customer does not exist', async () => {
      customerRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      const updateCustomerUsecase = new UpdateCustomerUsecase(
        customerRepositoryMock,
      );

      const input: UpdateCustomerInput = {
        id: 'non-existent-customer-id',
        name: 'Non Existent',
        email: 'nonexistent@doe.com',
        document: '00000000000',
        customerType: CustomerType.INDIVIDUAL,
      };

      const execute = async () => {
        await updateCustomerUsecase.execute(input);
      };

      await JestUtils.expectErrorAsync(
        execute,
        NotFoundUsecaseException,
        `Customer with id non-existent-customer-id not found while UpdateCustomerUsecase.`,
      );

      expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.findById).toHaveBeenCalledWith(
        'non-existent-customer-id',
      );
      expect(customerRepositoryMock.update).not.toHaveBeenCalled();
    });
  });
});
