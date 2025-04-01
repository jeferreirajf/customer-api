import { Customer } from '@/domain/entities/customer.entity';
import {
  Document,
  DocumentType,
} from '@/domain/value-objects/document.value-object';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

export type DocumentDynamodbModel = {
  document: string;
  documentType: string;
  createdAt: string;
  updatedAt: string;
};

export class CustomerDynamodbModel {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly document: DocumentDynamodbModel,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}

  public static fromEntity(customer: Customer): CustomerDynamodbModel {
    const document = {
      document: customer.getDocument().getDocument(),
      documentType: customer.getDocument().getType(),
      createdAt: customer.getDocument().getCreatedAt().toISOString(),
      updatedAt: customer.getDocument().getUpdatedAt().toISOString(),
    };

    return new CustomerDynamodbModel(
      customer.getId(),
      customer.getName(),
      customer.getEmail(),
      document,
      customer.getCreatedAt().toISOString(),
      customer.getUpdatedAt().toISOString(),
    );
  }

  public static fromDynamoDBItem(
    item: Record<string, AttributeValue>,
  ): CustomerDynamodbModel {
    const document = {
      document: item.document.M?.document.S ?? '',
      documentType: item.document.M?.documentType.S ?? '',
      createdAt: item.document.M?.createdAt.S ?? '',
      updatedAt: item.document.M?.updatedAt.S ?? '',
    };

    return new CustomerDynamodbModel(
      item.id.S ?? '',
      item.name.S ?? '',
      item.email.S ?? '',
      document,
      item.createdAt.S ?? '',
      item.updatedAt.S ?? '',
    );
  }

  public static toEntity(aModel: CustomerDynamodbModel): Customer {
    const document = Document.with({
      document: aModel.document.document,
      type: aModel.document.documentType as DocumentType,
      createdAt: new Date(aModel.document.createdAt),
      updatedAt: new Date(aModel.document.updatedAt),
    });

    return Customer.with({
      id: aModel.id,
      name: aModel.name,
      email: aModel.email,
      document,
      createdAt: new Date(aModel.createdAt),
      updatedAt: new Date(aModel.updatedAt),
    });
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getDocument(): DocumentDynamodbModel {
    return this.document;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  public toDynamoDBItem(): Record<string, AttributeValue> {
    const item: Record<string, AttributeValue> = {
      id: { S: this.id },
      name: { S: this.name },
      email: { S: this.email },
      document: {
        M: {
          document: { S: this.document.document },
          documentType: { S: this.document.documentType },
          createdAt: { S: this.document.createdAt },
          updatedAt: { S: this.document.updatedAt },
        },
      },
      createdAt: { S: this.createdAt },
      updatedAt: { S: this.updatedAt },
    };

    return item;
  }

  public toDynamoDbItemExpression(): Record<string, AttributeValue> {
    const item: Record<string, AttributeValue> = {
      ':name': { S: this.name },
      ':email': { S: this.email },
      ':document': {
        M: {
          document: { S: this.document.document },
          documentType: { S: this.document.documentType },
          createdAt: { S: this.document.createdAt },
          updatedAt: { S: this.document.updatedAt },
        },
      },
      ':createdAt': { S: this.createdAt },
      ':updatedAt': { S: this.updatedAt },
    };

    return item;
  }
}
