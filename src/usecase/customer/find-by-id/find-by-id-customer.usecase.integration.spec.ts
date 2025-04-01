import { Customer } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { CustomerDynamoDBRepository } from '@/infra/database/dynamodb/customer.dynamodb.repository';
import { DynamoDbClient } from '@/infra/database/dynamodb/dynamodb.client';
import { JestUtils } from '@/shared/utils/jest-utils';
import { NotFoundUsecaseException } from '@/usecase/exceptions/not-found-usecase.exception';
import { DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { FindByIdCustomerUsecase } from './find-by-id-customer.usecase';

describe('Integration::FindByIdCustomerUsecase', () => {
  let customerRepository: CustomerRepository;
  let dynamoDbClient: DynamoDbClient;
  let findByIdCustomerUsecase: FindByIdCustomerUsecase;

  beforeEach(async () => {
    dynamoDbClient = new DynamoDbClient();
    customerRepository = new CustomerDynamoDBRepository(dynamoDbClient);
    findByIdCustomerUsecase = new FindByIdCustomerUsecase(customerRepository);

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
    it('should find a customer by id successfully', async () => {
      const aCustomer = Customer.createIndividualCustomer({
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678900',
      });

      await customerRepository.create(aCustomer);

      const foundCustomer = await findByIdCustomerUsecase.execute({
        id: aCustomer.getId(),
      });

      expect(foundCustomer).toBeDefined();
      expect(foundCustomer.id).toBe(aCustomer.getId());
      expect(foundCustomer.name).toBe(aCustomer.getName());
      expect(foundCustomer.email).toBe(aCustomer.getEmail());
      expect(foundCustomer.document).toBe(
        aCustomer.getDocument().getDocument(),
      );
      expect(foundCustomer.createdAt).toEqual(aCustomer.getCreatedAt());
      expect(foundCustomer.updatedAt).toEqual(aCustomer.getUpdatedAt());
    });

    it('should throw an error if the customer does not exist', async () => {
      const nonExistentCustomerId = 'non-existent-id';

      const anError = async () => {
        await findByIdCustomerUsecase.execute({
          id: nonExistentCustomerId,
        });
      };

      await JestUtils.expectErrorAsync(
        anError,
        NotFoundUsecaseException,
        `Customer with id ${nonExistentCustomerId} not found while FindByIdCustomerUsecase.`,
      );
    });
  });
});
