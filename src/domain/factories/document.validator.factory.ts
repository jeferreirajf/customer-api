import { Validator } from '../shared/shared/validator/validator';
import { DocumentValueObjectZodValidator } from '../validators/document.value-object.validator';
import { Document } from '../value-objects/document.value-object';

export class DocumentValidatorFactory {
  private constructor() {}

  public static create(): Validator<Document> {
    return DocumentValueObjectZodValidator.create();
  }
}
