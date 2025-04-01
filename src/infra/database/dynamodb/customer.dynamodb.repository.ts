import { Customer } from '@/domain/entities/customer.entity';
import {
  CustomerRepository,
  PaginationData,
} from '@/domain/repositories/customer.repository';
import { Pagination } from '@/domain/shared/shared/types/pagination.dto';
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { DatabaseException } from '../exceptions/database.exception';
import { DynamoDbClient } from './dynamodb.client';
import { CustomerDynamodbModel } from './models/customer.dynamodb.model';

@Injectable()
export class CustomerDynamoDBRepository extends CustomerRepository {
  public constructor(private readonly dynamoDb: DynamoDbClient) {
    super();
  }

  public async create(customer: Customer): Promise<void> {
    const customerModel = CustomerDynamodbModel.fromEntity(customer);

    const item = customerModel.toDynamoDBItem();

    const putCommand: PutItemCommand = new PutItemCommand({
      TableName: 'customers',
      Item: item,
    });

    await this.dynamoDb.client.send(putCommand);
  }

  public async findById(id: string): Promise<Customer | null> {
    const getCommand: GetItemCommand = new GetItemCommand({
      TableName: 'customers',
      Key: {
        id: { S: id },
      },
      ConsistentRead: true,
    });

    const result = await this.dynamoDb.client.send(getCommand);

    if (!result?.Item) {
      return null;
    }

    const aModel = CustomerDynamodbModel.fromDynamoDBItem(result.Item);

    const anEntity = CustomerDynamodbModel.toEntity(aModel);

    return anEntity;
  }

  public async findAll(
    keyworkd: string,
    paginationData?: PaginationData,
  ): Promise<Pagination<Customer>> {
    const page = paginationData?.page ?? 1;
    const perPage = paginationData?.perPage ?? 10;
    const lastId = paginationData?.lastId;

    if (perPage > 20) {
      throw new DatabaseException(
        `You are trying to get ${perPage} items, but the maximum is 20`,
        CustomerDynamoDBRepository.name,
      );
    }

    if (page < 1) {
      throw new DatabaseException(
        `You are trying to get page ${page}, but the minimum is 1`,
        CustomerDynamoDBRepository.name,
      );
    }

    if (perPage < 1) {
      throw new DatabaseException(
        `You are trying to get ${perPage} items, but the minimum is 1`,
        CustomerDynamoDBRepository.name,
      );
    }

    if (!keyworkd || keyworkd.trim().length === 0) {
      throw new DatabaseException(
        `You are trying to get customers with empty keyword`,
        CustomerDynamoDBRepository.name,
      );
    }

    let scanCommand: ScanCommand = new ScanCommand({
      TableName: 'customers',
      FilterExpression:
        'contains(#name, :keyword) or contains(#email, :keyword) or contains(#document, :keyword) or contains(#documentType, :keyword)',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#email': 'email',
        '#document': 'document.document',
        '#documentType': 'document.documentType',
      },
      ExpressionAttributeValues: {
        ':keyword': { S: keyworkd },
      },
      ConsistentRead: true,
    });

    const count = await this.dynamoDb.client.send(scanCommand);

    if (!count?.Count) {
      return {
        items: [],
        total: 0,
        currentPage: page,
        perPage,
        next: null,
        prev: null,
        lastId: null,
      };
    }

    scanCommand = new ScanCommand({
      TableName: 'customers',
      FilterExpression:
        'contains(#name, :keyword) or contains(#email, :keyword) or contains(#document, :keyword) or contains(#documentType, :keyword)',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#email': 'email',
        '#document': 'document.document',
        '#documentType': 'document.documentType',
      },
      ExpressionAttributeValues: {
        ':keyword': { S: keyworkd },
      },
      ConsistentRead: true,
      Limit: perPage,
      ExclusiveStartKey: lastId
        ? {
            id: { S: lastId },
          }
        : undefined,
    });

    const result = await this.dynamoDb.client.send(scanCommand);

    const customers = result.Items.map((item) => {
      const aModel = CustomerDynamodbModel.fromDynamoDBItem(item);
      return CustomerDynamodbModel.toEntity(aModel);
    });

    const pagination: Pagination<Customer> = {
      items: customers,
      total: count.Count ?? 0,
      perPage,
      currentPage: page,
      next: result.LastEvaluatedKey ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
      lastId: result.LastEvaluatedKey ? result.LastEvaluatedKey.id.S : null,
    };

    return pagination;
  }

  public async update(customer: Customer): Promise<void> {
    const customerModel = CustomerDynamodbModel.fromEntity(customer);

    const item = customerModel.toDynamoDbItemExpression();

    const updateCommand: UpdateItemCommand = new UpdateItemCommand({
      TableName: 'customers',
      Key: {
        id: { S: customerModel.id },
      },
      UpdateExpression:
        'set #name = :name, #email = :email, #updatedAt = :updatedAt, #document = :document, #createdAt = :createdAt',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#email': 'email',
        '#updatedAt': 'updatedAt',
        '#document': 'document',
        '#createdAt': 'createdAt',
      },
      ExpressionAttributeValues: item,
      ReturnValues: 'ALL_NEW',
    });

    await this.dynamoDb.client.send(updateCommand);
  }

  public async delete(id: string): Promise<void> {
    const deleteCommand = new DeleteItemCommand({
      TableName: 'customers',
      Key: {
        id: { S: id },
      },
      ReturnValues: 'ALL_OLD',
    });

    await this.dynamoDb.client.send(deleteCommand);
  }
}

export const CustomerDynamoDBRepositoryProvider = {
  provide: CustomerRepository,
  useClass: CustomerDynamoDBRepository,
};
