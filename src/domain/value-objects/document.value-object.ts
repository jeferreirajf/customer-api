import { DocumentValidatorFactory } from '../factories/document.validator.factory';
import { ValueObject } from '../shared/shared/value-objects/value-object';

export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

export type DocumentWithInput = {
  document: string;
  type: DocumentType;
  createdAt: Date;
  updatedAt: Date;
};

export class Document extends ValueObject {
  private constructor(
    private readonly document: string,
    private readonly type: DocumentType,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(createdAt, updatedAt);
    this.validate();
  }

  public static createLegalDocument(document: string): Document {
    const type = DocumentType.CNPJ;
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Document(document, type, createdAt, updatedAt);
  }

  public static createIndividualDocument(document: string): Document {
    const type = DocumentType.CPF;
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Document(document, type, createdAt, updatedAt);
  }

  public static with(input: DocumentWithInput): Document {
    return new Document(
      input.document,
      input.type,
      input.createdAt,
      input.updatedAt,
    );
  }

  protected validate(): void {
    DocumentValidatorFactory.create().validate(this);
  }

  public getDocument(): string {
    return this.document;
  }

  public getType(): DocumentType {
    return this.type;
  }
}
