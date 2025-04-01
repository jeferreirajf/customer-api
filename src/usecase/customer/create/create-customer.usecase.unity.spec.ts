import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { CustomerRepositoryMock } from '../_mocks/customer-repository.mock';
import {
  CreateCustomerInput,
  CreateCustomerUsecase,
  CustomerType,
} from './create-customer.usecase';
import { JestUtils } from '@/shared/utils/jest-utils';
import { BadRequestUsecaseException } from '@/usecase/exceptions/bad-request-usecase.exception';

describe('CreateCustomerUseCase', () => {
  let customerRepositoryMock: CustomerRepository;

  beforeEach(() => {
    customerRepositoryMock = CustomerRepositoryMock.generate();
  });

  describe('execute', () => {
    it('should create a customer and call customerRepository.create while all params are valid and customer type is INDIVIDUAL', async () => {
      const input: CreateCustomerInput = {
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678901',
        customerType: CustomerType.INDIVIDUAL,
      };

      const anUsecase = new CreateCustomerUsecase(customerRepositoryMock);

      const result = await anUsecase.execute(input);

      expect(result).toEqual({
        id: expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        ),
      });
      expect(customerRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: input.name,
          email: input.email,
          document: expect.objectContaining({
            document: input.document,
            type: 'CPF',
          }),
        }),
      );
    });

    it('should create a customer and call customerRepository.create while all params are valid and customerType is LEGAL', async () => {
      const input: CreateCustomerInput = {
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678901234',
        customerType: CustomerType.LEGAL,
      };

      const anUsecase = new CreateCustomerUsecase(customerRepositoryMock);

      const result = await anUsecase.execute(input);

      expect(result).toEqual({
        id: expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        ),
      });

      expect(customerRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(customerRepositoryMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: input.name,
          email: input.email,
          document: expect.objectContaining({
            document: input.document,
            type: 'CNPJ',
          }),
        }),
      );
    });

    it('should throw an error while customerType is not valid', async () => {
      const input: CreateCustomerInput = {
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678901234',
        customerType: 'INVALID-TYPE' as CustomerType,
      };

      const anUsecase = new CreateCustomerUsecase(customerRepositoryMock);

      const anError = async () => {
        await anUsecase.execute(input);
      };

      await JestUtils.expectErrorAsync(
        anError,
        BadRequestUsecaseException,
        `Customer type INVALID-TYPE is not valid while CreateCustomerUsecase`,
      );
    });
  });
});
