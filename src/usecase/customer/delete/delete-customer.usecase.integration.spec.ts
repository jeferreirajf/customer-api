import { Customer } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { CustomerDynamoDBRepository } from '@/infra/database/dynamodb/customer.dynamodb.repository';
import { DynamoDbClient } from '@/infra/database/dynamodb/dynamodb.client';
import { JestUtils } from '@/shared/utils/jest-utils';
import { DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DeleteCustomerUsecase } from './delete-customer.usecase';
import { NotFoundUsecaseException } from '@/usecase/exceptions/not-found-usecase.exception';

describe('Integration::DeleteCustomerUsecase', () => {
  let customerRepository: CustomerRepository;
  let dynamoDbClient: DynamoDbClient;
  let deleteCustomerUsecase: DeleteCustomerUsecase;

  beforeEach(async () => {
    dynamoDbClient = new DynamoDbClient();
    customerRepository = new CustomerDynamoDBRepository(dynamoDbClient);
    deleteCustomerUsecase = new DeleteCustomerUsecase(customerRepository);

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
    it('should delete a customer successfully', async () => {
      const aCustomer = Customer.createIndividualCustomer({
        name: 'Jane Doe',
        email: 'jane@doe.com',
        document: '98765432100',
      });

      await customerRepository.create(aCustomer);

      const createdCustomer = await customerRepository.findById(
        aCustomer.getId(),
      );

      expect(createdCustomer).toBeDefined();

      await deleteCustomerUsecase.execute({ id: aCustomer.getId() });

      const deletedCustomer = await customerRepository.findById(
        aCustomer.getId(),
      );

      expect(deletedCustomer).toBeNull();
    });

    it('should throw an error if the customer does not exist', async () => {
      const nonExistentCustomerId = 'non-existent-id';

      const anError = async () => {
        await deleteCustomerUsecase.execute({
          id: nonExistentCustomerId,
        });
      };

      await JestUtils.expectErrorAsync(
        anError,
        NotFoundUsecaseException,
        `Customer with id ${nonExistentCustomerId} not found while DeleteCustomerUsecase.`,
      );
    });
  });
});
