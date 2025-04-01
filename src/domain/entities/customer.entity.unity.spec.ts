import { JestUtils } from '@/shared/utils/jest-utils';
import { Customer } from './customer.entity';
import { Document, DocumentType } from '../value-objects/document.value-object';
import { ValidationDomainException } from '../shared/shared/exceptions/validation.domain.exception';
import { Utils } from '@/shared/utils/utils';

describe('Customer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createLegalCustomer', () => {
    it('should create a legal customer with valid parameters', () => {
      const input = {
        name: 'Legal Customer',
        email: 'legal@example.com',
        document: '12345678000195',
      };

      const customer = Customer.createLegalCustomer(input);

      expect(customer.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );

      expect(customer.getName()).toBe(input.name);
      expect(customer.getEmail()).toBe(input.email);
      expect(customer.getDocument().getDocument()).toBe(input.document);
      expect(customer.getDocument().getType()).toBe(DocumentType.CNPJ);

      expect(customer.getCreatedAt()).toBeInstanceOf(Date);
      expect(customer.getUpdatedAt()).toBeInstanceOf(Date);

      expect(customer.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        customer.getCreatedAt().getTime(),
      );
    });

    it('should call validate method when creating a legal customer', () => {
      interface IEntity {
        validate(): void;
      }

      const validateSpy = jest.spyOn(
        Customer.prototype as unknown as IEntity,
        'validate',
      );

      Customer.createLegalCustomer({
        name: 'Legal Customer',
        email: 'legal@example.com',
        document: '12345678000195',
      });

      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('createIndividualCustomer', () => {
    it('should create an individual customer with valid parameters', () => {
      const input = {
        name: 'Individual Customer',
        email: 'individual@example.com',
        document: '12345678901',
      };

      const customer = Customer.createIndividualCustomer(input);

      expect(customer.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );

      expect(customer.getName()).toBe(input.name);
      expect(customer.getEmail()).toBe(input.email);
      expect(customer.getDocument().getDocument()).toBe(input.document);
      expect(customer.getDocument().getType()).toBe(DocumentType.CPF);

      expect(customer.getCreatedAt()).toBeInstanceOf(Date);
      expect(customer.getUpdatedAt()).toBeInstanceOf(Date);

      expect(customer.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        customer.getCreatedAt().getTime(),
      );
    });

    it('should call validate method when creating an individual customer', () => {
      interface IEntity {
        validate(): void;
      }

      const validateSpy = jest.spyOn(
        Customer.prototype as unknown as IEntity,
        'validate',
      );

      Customer.createIndividualCustomer({
        name: 'Individual Customer',
        email: 'individual@example.com',
        document: '12345678901',
      });

      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('updateName', () => {
    it('should update the customer name', () => {
      const customer = Customer.createIndividualCustomer({
        name: 'Old Name',
        email: 'customer@example.com',
        document: '12345678901',
      });

      customer.updateName('New Name');

      expect(customer.getName()).toBe('New Name');
      expect(customer.getEmail()).toBe('customer@example.com');
      expect(customer.getDocument().getDocument()).toBe('12345678901');
      expect(customer.getDocument().getType()).toBe(DocumentType.CPF);
    });

    it('should call validate method when updating the name', () => {
      interface IEntity {
        validate(): void;
      }

      const validateSpy = jest.spyOn(
        Customer.prototype as unknown as IEntity,
        'validate',
      );

      const customer = Customer.createIndividualCustomer({
        name: 'Old Name',
        email: 'customer@example.com',
        document: '12345678901',
      });

      customer.updateName('New Name');

      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('updateEmail', () => {
    it('should update the customer email', () => {
      const customer = Customer.createIndividualCustomer({
        name: 'Customer',
        email: 'old@example.com',
        document: '12345678901',
      });

      customer.updateEmail('new@example.com');

      expect(customer.getEmail()).toBe('new@example.com');
      expect(customer.getName()).toBe('Customer');
      expect(customer.getDocument().getDocument()).toBe('12345678901');
      expect(customer.getDocument().getType()).toBe(DocumentType.CPF);
    });

    it('should call validate method when updating the email', () => {
      interface IEntity {
        validate(): void;
      }

      const validateSpy = jest.spyOn(
        Customer.prototype as unknown as IEntity,
        'validate',
      );

      const customer = Customer.createIndividualCustomer({
        name: 'Customer',
        email: 'old@example.com',
        document: '12345678901',
      });

      customer.updateEmail('new@example.com');

      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('updateDocument', () => {
    it('should update the customer document to a legal document', () => {
      const customer = Customer.createIndividualCustomer({
        name: 'Customer',
        email: 'customer@example.com',
        document: '12345678901',
      });

      customer.updateDocument('12345678000195', DocumentType.CNPJ);

      expect(customer.getDocument().getDocument()).toBe('12345678000195');
      expect(customer.getDocument().getType()).toBe(DocumentType.CNPJ);
      expect(customer.getName()).toBe('Customer');
      expect(customer.getEmail()).toBe('customer@example.com');
    });

    it('should call validate method when updating the document', () => {
      interface IEntity {
        validate(): void;
      }

      const validateSpy = jest.spyOn(
        Customer.prototype as unknown as IEntity,
        'validate',
      );

      const customer = Customer.createIndividualCustomer({
        name: 'Customer',
        email: 'customer@example.com',
        document: '12345678901',
      });

      customer.updateDocument('12345678000195', DocumentType.CNPJ);

      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('validate', () => {
    it('should throw an error when id is not a valid UUID', () => {
      const invalidId = 'invalid-uuid';

      const anError = () => {
        Customer.with({
          id: invalidId,
          name: 'Valid Name',
          email: 'valid@example.com',
          document: Document.createIndividualDocument('12345678901'),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'id: Invalid uuid',
      );
    });

    it('should throw an error when name is empty', () => {
      const invalidName = '';

      const anError = () => {
        Customer.with({
          id: Utils.GenerateRandomUUID(),
          name: invalidName,
          email: 'valid@example.com',
          document: Document.createIndividualDocument('12345678901'),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'name: String must contain at least 1 character(s)',
      );
    });

    it('should throw an error when email is invalid', () => {
      const invalidEmail = 'invalid-email';

      const anError = () => {
        Customer.with({
          id: Utils.GenerateRandomUUID(),
          name: 'Valid Name',
          email: invalidEmail,
          document: Document.createIndividualDocument('12345678901'),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'email: Invalid email',
      );
    });

    it('should throw an error when document is null', () => {
      const anError = () => {
        Customer.with({
          id: Utils.GenerateRandomUUID(),
          name: 'Valid Name',
          email: 'valid@email.com',
          document: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'document: Expected object, received null',
      );
    });

    it('should throw an error when document is undefined', () => {
      const anError = () => {
        Customer.with({
          id: Utils.GenerateRandomUUID(),
          name: 'Valid Name',
          email: 'valid@email.com',
          document: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'document: Required',
      );
    });

    it('should throw an error when createdAt is greater than updatedAt', () => {
      const createdAt = new Date();
      const updatedAt = new Date(createdAt.getTime() - 1000);

      const anError = () => {
        Customer.with({
          id: Utils.GenerateRandomUUID(),
          name: 'Valid Name',
          email: 'valid@example.com',
          document: Document.createIndividualDocument('12345678901'),
          createdAt,
          updatedAt,
        });
      };

      JestUtils.expectError(
        anError,
        ValidationDomainException,
        'createdAt must be less than or equal to updatedAt.',
      );
    });

    it('should validate successfully with valid input', () => {
      const customer = Customer.with({
        id: Utils.GenerateRandomUUID(),
        name: 'Valid Name',
        email: 'valid@example.com',
        document: Document.createIndividualDocument('12345678901'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(customer.getName()).toBe('Valid Name');
      expect(customer.getEmail()).toBe('valid@example.com');
      expect(customer.getDocument().getDocument()).toBe('12345678901');
      expect(customer.getDocument().getType()).toBe(DocumentType.CPF);
    });
  });
});
