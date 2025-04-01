import { Customer } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { CustomerDynamoDBRepository } from '@/infra/database/dynamodb/customer.dynamodb.repository';
import { DynamoDbClient } from '@/infra/database/dynamodb/dynamodb.client';
import { DatabaseException } from '@/infra/database/exceptions/database.exception';
import { JestUtils } from '@/shared/utils/jest-utils';
import { SearchCustomerUsecase } from './search-customer.usecase';
import { DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';

describe('Integration::SearchCustomerUsecase', () => {
  let customerRepository: CustomerRepository;
  let dynamoDbClient: DynamoDbClient;
  let searchCustomerUsecase: SearchCustomerUsecase;

  beforeEach(async () => {
    dynamoDbClient = new DynamoDbClient();
    customerRepository = new CustomerDynamoDBRepository(dynamoDbClient);
    searchCustomerUsecase = new SearchCustomerUsecase(customerRepository);

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

  function generateRandomCpf() {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return randomNumber.toString().padStart(11, '0');
  }

  describe('execute', () => {
    it('should return a paginated list of customers matching the keyword', async () => {
      const customer1 = Customer.createIndividualCustomer({
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678900',
      });

      const customer2 = Customer.createIndividualCustomer({
        name: 'Jane Doe',
        email: 'jane@doe.com',
        document: '98765432100',
      });

      const customer3 = Customer.createIndividualCustomer({
        name: 'Jack Smith',
        email: 'jack@smith.com',
        document: '45678912300',
      });

      await customerRepository.create(customer1);
      await customerRepository.create(customer2);
      await customerRepository.create(customer3);

      const result = await searchCustomerUsecase.execute({
        keyword: 'doe',
        page: 1,
        perPage: 10,
      });

      const receivedCustomer1 = result.result.find(
        (customer) => customer.id === customer1.getId(),
      );

      const receivedCustomer2 = result.result.find(
        (customer) => customer.id === customer2.getId(),
      );

      expect(result).toBeDefined();
      expect(result.result.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.next).toBe(null);
      expect(result.prev).toBe(null);

      expect(receivedCustomer1).toBeDefined();
      expect(receivedCustomer2).toBeDefined();

      expect(receivedCustomer1.name).toBe(customer1.getName());
      expect(receivedCustomer1.email).toBe(customer1.getEmail());
      expect(receivedCustomer1.document).toBe(
        customer1.getDocument().getDocument(),
      );

      expect(receivedCustomer2.name).toBe(customer2.getName());
      expect(receivedCustomer2.email).toBe(customer2.getEmail());
      expect(receivedCustomer2.document).toBe(
        customer2.getDocument().getDocument(),
      );

      expect(receivedCustomer1.createdAt.toISOString()).toBe(
        customer1.getCreatedAt().toISOString(),
      );
      expect(receivedCustomer1.updatedAt.toISOString()).toBe(
        customer1.getUpdatedAt().toISOString(),
      );

      expect(receivedCustomer2.createdAt.toISOString()).toBe(
        customer2.getCreatedAt().toISOString(),
      );
      expect(receivedCustomer2.updatedAt.toISOString()).toBe(
        customer2.getUpdatedAt().toISOString(),
      );
    });

    it('should return an empty list if no customers match the keyword', async () => {
      const customer1 = Customer.createIndividualCustomer({
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678900',
      });

      const customer2 = Customer.createIndividualCustomer({
        name: 'Jane Doe',
        email: 'jane@doe.com',
        document: '98765432100',
      });

      await customerRepository.create(customer1);
      await customerRepository.create(customer2);

      const result = await searchCustomerUsecase.execute({
        keyword: 'NonExistent',
        page: 1,
        perPage: 10,
      });

      expect(result).toBeDefined();
      expect(result.result.length).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should handle pagination correctly', async () => {
      for (let i = 1; i <= 25; i++) {
        const customer = Customer.createIndividualCustomer({
          name: `Customer ${i}`,
          email: `customer${i}@example.com`,
          document: generateRandomCpf(),
        });

        await customerRepository.create(customer);
      }

      const resultPage1 = await searchCustomerUsecase.execute({
        keyword: 'Customer',
        page: 1,
        perPage: 15,
        lastId: null,
      });

      const resultPage2 = await searchCustomerUsecase.execute({
        keyword: 'Customer',
        page: 2,
        perPage: 15,
        lastId: resultPage1.result[resultPage1.result.length - 1].id,
      });

      expect(resultPage1).toBeDefined();
      expect(resultPage1.result.length).toBe(15);
      expect(resultPage1.page).toBe(1);
      expect(resultPage1.perPage).toBe(15);
      expect(resultPage1.prev).toBe(null);
      expect(resultPage1.next).toBe(2);
      expect(resultPage1.lastId).toBe(
        resultPage1.result[resultPage1.result.length - 1].id,
      );
      expect(resultPage1.total).toBe(25);

      expect(resultPage2).toBeDefined();
      expect(resultPage2.result.length).toBe(10);
      expect(resultPage2.page).toBe(2);
      expect(resultPage2.perPage).toBe(15);
      expect(resultPage2.prev).toBe(1);
      expect(resultPage2.next).toBe(null);
      expect(resultPage2.lastId).toBe(null);
      expect(resultPage2.total).toBe(25);
    });

    it('should throw an error if the keyword is empty', async () => {
      const anError = async () => {
        await searchCustomerUsecase.execute({
          keyword: '',
          page: 1,
          perPage: 10,
        });
      };

      await JestUtils.expectErrorAsync(
        anError,
        DatabaseException,
        'You are trying to get customers with empty keyword',
      );
    });

    it('should throw an error if perPage exceeds the limit of 20 items', async () => {
      const anError = async () => {
        await searchCustomerUsecase.execute({
          keyword: 'Customer',
          page: 1,
          perPage: 21,
        });
      };

      await JestUtils.expectErrorAsync(
        anError,
        DatabaseException,
        'You are trying to get 21 items, but the maximum is 20',
      );
    });

    it('should throw an error if page is less than 1', async () => {
      const anError = async () => {
        await searchCustomerUsecase.execute({
          keyword: 'Customer',
          page: 0,
          perPage: 10,
        });
      };

      await JestUtils.expectErrorAsync(
        anError,
        DatabaseException,
        'You are trying to get page 0, but the minimum is 1',
      );
    });

    it('should throw an error if perPage is less than 1', async () => {
      const anError = async () => {
        await searchCustomerUsecase.execute({
          keyword: 'Customer',
          page: 1,
          perPage: 0,
        });
      };

      await JestUtils.expectErrorAsync(
        anError,
        DatabaseException,
        'You are trying to get 0 items, but the minimum is 1',
      );
    });
  });
});
