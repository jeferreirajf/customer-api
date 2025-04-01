import { Customer } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { CustomerDynamoDBRepository } from '@/infra/database/dynamodb/customer.dynamodb.repository';
import { DynamoDbClient } from '@/infra/database/dynamodb/dynamodb.client';
import { DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';

describe('Integration::CreateCustomerUsecase', () => {
  let customerRepository: CustomerRepository;
  let dynamoDbClient: DynamoDbClient;

  beforeEach(async () => {
    dynamoDbClient = new DynamoDbClient();
    customerRepository = new CustomerDynamoDBRepository(dynamoDbClient);

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
    it('should create a customer successfully', async () => {
      const aCustomer = Customer.createIndividualCustomer({
        name: 'John Doe',
        email: 'john@doe.com',
        document: '12345678900',
      });

      await customerRepository.create(aCustomer);

      const createdCustomer = await customerRepository.findById(
        aCustomer.getId(),
      );

      expect(createdCustomer).toBeDefined();
      expect(createdCustomer?.getId()).toEqual(aCustomer.getId());
      expect(createdCustomer?.getName()).toEqual(aCustomer.getName());
      expect(createdCustomer?.getEmail()).toEqual(aCustomer.getEmail());
      expect(createdCustomer?.getDocument().getDocument()).toEqual(
        aCustomer.getDocument().getDocument(),
      );
      expect(createdCustomer?.getDocument().getType()).toEqual(
        aCustomer.getDocument().getType(),
      );
      expect(createdCustomer?.getCreatedAt()).toEqual(aCustomer.getCreatedAt());
      expect(createdCustomer?.getUpdatedAt()).toEqual(aCustomer.getUpdatedAt());
      expect(createdCustomer?.getCreatedAt()).toEqual(
        createdCustomer?.getUpdatedAt(),
      );
    });
  });
});
