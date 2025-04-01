import { z } from 'zod';
import { Validator } from '../shared/shared/validator/validator';
import { Document, DocumentType } from '../value-objects/document.value-object';
import { ZodUtils } from '../shared/shared/utils/zod.utils';
import { ValidationDomainException } from '../shared/shared/exceptions/validation.domain.exception';

export class DocumentValueObjectZodValidator implements Validator<Document> {
  private constructor() {}

  public static create(): DocumentValueObjectZodValidator {
    return new DocumentValueObjectZodValidator();
  }

  public validate(input: Document): void {
    try {
      this.getSchema().parse(input);
    } catch (error) {
      let errorMessage: string = '';

      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError;
        errorMessage = ZodUtils.formatZodError(zodError);
      } else {
        errorMessage = `An unexpected error occurred while ${DocumentValueObjectZodValidator.name}.`;
      }

      throw new ValidationDomainException(
        errorMessage,
        DocumentValueObjectZodValidator.name,
      );
    }
  }

  private getSchema() {
    const schema = z
      .object({
        document: z
          .string()
          .trim()
          .min(11, { message: 'Document must have at least 11 characters.' })
          .max(14, { message: 'Document must have at most 14 characters.' }),
        type: z.enum(['CPF', 'CNPJ'], {
          message: 'Type must be either CPF or CNPJ.',
        }),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .refine(
        (data) => {
          const createdAt = data.createdAt;
          const updatedAt = data.updatedAt;

          return createdAt <= updatedAt;
        },
        {
          message: `createdAt must be less than or equal to updatedAt.`,
        },
      )
      .refine(
        (data) => {
          const document = data.document;
          const type = data.type;

          if (type === DocumentType.CPF) {
            return document.length === 11;
          } else if (type === DocumentType.CNPJ) {
            return document.length === 14;
          }
          return false;
        },
        {
          message: `document.document must have 11 characters for CPF and 14 characters for CNPJ.`,
        },
      );

    return schema;
  }
}
