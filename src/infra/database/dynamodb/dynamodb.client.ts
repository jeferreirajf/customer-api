import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DatabaseException } from '../exceptions/database.exception';

@Injectable()
export class DynamoDbClient {
  private dynamoDbClient: DynamoDBClient;

  public constructor() {
    const region = process.env.AWS_REGION || 'us-east-1';
    const endpoint =
      process.env.AWS_DYNAMODB_ENDPOINT || 'http://localhost:8000';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'local';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || 'local';

    if (!region || !endpoint || !accessKeyId || !secretAccessKey) {
      throw new DatabaseException(
        `Missing required environment variables for DynamoDB client. Region: ${region !== undefined}, Endpoint: ${endpoint !== undefined}, AccessKeyId: ${accessKeyId !== undefined}, SecretAccessKey: ${secretAccessKey !== undefined}`,
        DynamoDbClient.name,
      );
    }

    this.dynamoDbClient = new DynamoDBClient({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  public get client(): DynamoDBClient {
    return this.dynamoDbClient;
  }
}
