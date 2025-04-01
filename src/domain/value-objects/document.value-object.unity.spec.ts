import { JestUtils } from '@/shared/utils/jest-utils';
import { Document, DocumentType } from './document.value-object';
import { ValidationDomainException } from '../shared/shared/exceptions/validation.domain.exception';

describe('Document', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createLegalDocument', () => {
    it('should create a legal document with valid parameters', () => {
      const document = Document.createLegalDocument('12345678000195');

      expect(document.getDocument()).toBe('12345678000195');
      expect(document.getType()).toBe('CNPJ');

      expect(document.getCreatedAt()).toBeInstanceOf(Date);
      expect(document.getUpdatedAt()).toBeInstanceOf(Date);

      expect(document.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        document.getCreatedAt().getTime(),
      );
    });

    it('should call validate method when creating a legal document', () => {
      interface IEntity {
        validate(): void;
      }

      const validateSpy = jest.spyOn(
        Document.prototype as unknown as IEntity,
        'validate',
      );

      Document.createLegalDocument('12345678000195');

      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('createIndividualDocument', () => {
    it('should create an individual document with valid parameters', () => {
      const document = Document.createIndividualDocument('12345678901');

      expect(document.getDocument()).toBe('12345678901');
      expect(document.getType()).toBe('CPF');

      expect(document.getCreatedAt()).toBeInstanceOf(Date);
      expect(document.getUpdatedAt()).toBeInstanceOf(Date);

      expect(document.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        document.getCreatedAt().getTime(),
      );
    });

    it('should call validate method when creating an individual document', () => {
      interface IEntity {
        validate(): void;
      }

      const validateSpy = jest.spyOn(
        Document.prototype as unknown as IEntity,
        'validate',
      );

      Document.createIndividualDocument('12345678901');

      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('with', () => {
    it('should create a document with input', () => {
      const input = {
        document: '12345678901',
        type: DocumentType.CPF,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const document = Document.with(input);

      expect(document.getDocument()).toBe('12345678901');
      expect(document.getType()).toBe('CPF');
      expect(document.getCreatedAt()).toBe(input.createdAt);
      expect(document.getUpdatedAt()).toBe(input.updatedAt);
    });

    it('should call validate method when creating a document with input', () => {
      interface IEntity {
        validate(): void;
      }

      const validateSpy = jest.spyOn(
        Document.prototype as unknown as IEntity,
        'validate',
      );

      const input = {
        document: `12345678901234`,
        type: DocumentType.CNPJ,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      Document.with(input);

      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('validate', () => {
    it('should throw an error when document is empty', async () => {
      const invalidDocument = '';

      const anError = () => {
        Document.createIndividualDocument(invalidDocument);
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'Document must have at least 11 characters.',
      );
    });

    it('should throw an error when document is null', async () => {
      const invalidDocument = null;

      const anError = () => {
        Document.createIndividualDocument(invalidDocument as unknown as string);
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'document: Expected string, received null',
      );
    });

    it('should throw an error when document is undefined', async () => {
      const invalidDocument = undefined;

      const anError = () => {
        Document.createIndividualDocument(invalidDocument as unknown as string);
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'document: Required',
      );
    });

    it('should throw an error when document length is less than 11', async () => {
      const invalidDocument = '1234567890';

      const anError = () => {
        Document.createIndividualDocument(invalidDocument);
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'Document must have at least 11 characters.',
      );
    });

    it('should throw an error when document length is greater than 14', async () => {
      const invalidDocument = '123456780001951234';

      const anError = () => {
        Document.createLegalDocument(invalidDocument);
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'Document must have at most 14 characters.',
      );
    });

    it('should throw an error when createdAt is greater than updatedAt', async () => {
      const invalidCreatedAt = new Date();
      const invalidUpdatedAt = new Date(invalidCreatedAt.getTime() - 1000);

      const anError = () => {
        Document.with({
          document: '12345678901',
          type: DocumentType.CPF,
          createdAt: invalidCreatedAt,
          updatedAt: invalidUpdatedAt,
        });
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'createdAt must be less than or equal to updatedAt.',
      );
    });

    it('should throw an error when document type is invalid', async () => {
      const invalidDocumentType = 'INVALID_TYPE' as DocumentType;

      const anError = () => {
        Document.with({
          document: '12345678901',
          type: invalidDocumentType,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'Type must be either CPF or CNPJ.',
      );
    });

    it('should throw an error when document length is incompatible with type', async () => {
      let invalidDocument = '12345678901';
      let invalidDocumentType = DocumentType.CNPJ;

      let anError = () => {
        Document.with({
          document: invalidDocument,
          type: invalidDocumentType,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'document.document must have 11 characters for CPF and 14 characters for CNPJ.',
      );

      invalidDocument = '12345678000195';
      invalidDocumentType = DocumentType.CPF;

      anError = () => {
        Document.with({
          document: invalidDocument,
          type: invalidDocumentType,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'document.document must have 11 characters for CPF and 14 characters for CNPJ.',
      );
    });
  });
});
