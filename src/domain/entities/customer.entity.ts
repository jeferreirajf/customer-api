import { Utils } from '@/shared/utils/utils';
import { Entity } from '../shared/shared/entities/entity';
import { DomainException } from '../shared/shared/exceptions/domain.exception';
import { Document, DocumentType } from '../value-objects/document.value-object';
import { CustomerValidatorFactory } from '../factories/customer.validator.factory';

export type CreateLegalCustomerInput = {
  name: string;
  email: string;
  document: string;
};

export type CreateIndividualCustomerInput = {
  name: string;
  email: string;
  document: string;
};

export type CustomerWithInput = {
  id: string;
  name: string;
  email: string;
  document: Document;
  createdAt: Date;
  updatedAt: Date;
};

export class Customer extends Entity {
  private constructor(
    id: string,
    private name: string,
    private email: string,
    private document: Document,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.validate();
  }

  public static createLegalCustomer(data: CreateLegalCustomerInput) {
    const id = Utils.GenerateRandomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    const document = Document.createLegalDocument(data.document);

    return new Customer(
      id,
      data.name,
      data.email,
      document,
      createdAt,
      updatedAt,
    );
  }

  public static createIndividualCustomer(data: CreateIndividualCustomerInput) {
    const id = Utils.GenerateRandomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    const document = Document.createIndividualDocument(data.document);

    return new Customer(
      id,
      data.name,
      data.email,
      document,
      createdAt,
      updatedAt,
    );
  }

  public static with(input: CustomerWithInput): Customer {
    return new Customer(
      input.id,
      input.name,
      input.email,
      input.document,
      input.createdAt,
      input.updatedAt,
    );
  }

  protected validate(): void {
    CustomerValidatorFactory.create().validate(this);
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getDocument(): Document {
    return this.document;
  }

  public updateName(name: string): void {
    this.name = name;
    this.validate();
    this.hasChanged();
  }

  public updateEmail(email: string): void {
    this.email = email;
    this.validate();
    this.hasChanged();
  }

  public updateDocument(document: string, documentType: DocumentType): void {
    if (documentType === DocumentType.CNPJ) {
      this.document = Document.createLegalDocument(document);
    } else if (documentType === DocumentType.CPF) {
      this.document = Document.createIndividualDocument(document);
    } else {
      throw new DomainException(
        `Invalid document type ${documentType} while updating document for customer ${this.name}`,
        Customer.name,
      );
    }

    this.validate();
    this.hasChanged();
  }
}
