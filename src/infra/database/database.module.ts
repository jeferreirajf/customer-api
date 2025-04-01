import { Module } from '@nestjs/common';
import { DynamoDbClient } from './dynamodb/dynamodb.client';
import { CustomerDynamoDBRepositoryProvider } from './dynamodb/customer.dynamodb.repository';

@Module({
  providers: [DynamoDbClient, CustomerDynamoDBRepositoryProvider],
  exports: [CustomerDynamoDBRepositoryProvider],
})
export class DatabaseModule {}
