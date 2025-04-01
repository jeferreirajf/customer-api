import { Customer } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { CustomerDynamoDBRepository } from '@/infra/database/dynamodb/customer.dynamodb.repository';
import { DynamoDbClient } from '@/infra/database/dynamodb/dynamodb.client';
import {
  UpdateCustomerInput,
  UpdateCustomerUsecase,
} from './update-customer.usecase';
import { CustomerType } from '../create/create-customer.usecase';
import { JestUtils } from '@/shared/utils/jest-utils';
import { DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { NotFoundUsecaseException } from '@/usecase/exceptions/not-found-usecase.exception';

describe('Integration::UpdateCustomerUsecase', () => {
  let customerRepository: CustomerRepository;
  let dynamoDbClient: DynamoDbClient;
  let updateCustomerUsecase: UpdateCustomerUsecase;

  beforeEach(async () => {
    dynamoDbClient = new DynamoDbClient();
    customerRepository = new CustomerDynamoDBRepository(dynamoDbClient);
    updateCustomerUsecase = new UpdateCustomerUsecase(customerRepository);

    await cleanTable();
  });

  async function cleanTable() {
    const scanCommand: ScanCommand = new ScanCommand({
      TableName: 'customers',
      ConsistentRead: true,
    });

    const items = await dynamoDbClient.client.send(scanCommand);

    for (const item of items.Items) {
      const deleteCommand = new DeleteItemCommand({
        TableName: 'customers',
        Key: { id: item.id },
      });

      await dynamoDbClient.client.send(deleteCommand);
    }
  }

  describe('execute', () => {
    it('should update an existing customer successfully', async () => {
      const customer = Customer.createIndividualCustomer({
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678900',
      });

      await customerRepository.create(customer);

      const updatedCustomerInput: UpdateCustomerInput = {
        id: customer.getId(),
        name: 'John Updated',
        email: 'john.updated@doe.com',
        document: '98765432100',
        customerType: CustomerType.INDIVIDUAL,
      };

      const result = await updateCustomerUsecase.execute(updatedCustomerInput);

      const updatedCustomer = await customerRepository.findById(result.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(customer.getId());
      expect(updatedCustomer).toBeDefined();
      expect(updatedCustomer.getName()).toBe(updatedCustomerInput.name);
      expect(updatedCustomer.getEmail()).toBe(updatedCustomerInput.email);
      expect(updatedCustomer.getDocument().getDocument()).toBe(
        updatedCustomerInput.document,
      );
    });

    it('should throw an error if the customer does not exist', async () => {
      const nonExistentCustomerInput: UpdateCustomerInput = {
        id: 'non-existent-id',
        name: 'Non Existent',
        email: 'non.existent@doe.com',
        document: '12345678900',
        customerType: CustomerType.INDIVIDUAL,
      };

      const anError = async () => {
        await updateCustomerUsecase.execute(nonExistentCustomerInput);
      };

      JestUtils.expectErrorAsync(
        anError,
        NotFoundUsecaseException,
        `Customer with id ${nonExistentCustomerInput.id} not found while UpdateCustomerUsecase.`,
      );
    });

    it('should update a customer with type COMPANY successfully', async () => {
      const customer = Customer.createLegalCustomer({
        name: 'Company ABC',
        email: 'contact@companyabc.com',
        document: '12345678000199',
      });

      await customerRepository.create(customer);

      const updatedCustomerInput = {
        id: customer.getId(),
        name: 'Company XYZ',
        email: 'contact@companyxyz.com',
        document: '98765432000199',
        customerType: CustomerType.LEGAL,
      };

      const result = await updateCustomerUsecase.execute(updatedCustomerInput);

      const updatedCustomer = await customerRepository.findById(result.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(customer.getId());
      expect(updatedCustomer).toBeDefined();
      expect(updatedCustomer.getName()).toBe(updatedCustomerInput.name);
      expect(updatedCustomer.getEmail()).toBe(updatedCustomerInput.email);
      expect(updatedCustomer.getDocument().getDocument()).toBe(
        updatedCustomerInput.document,
      );
    });
  });
});
