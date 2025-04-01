import { z } from 'zod';
import { Customer } from '../entities/customer.entity';
import { Validator } from '../shared/shared/validator/validator';
import { ZodUtils } from '../shared/shared/utils/zod.utils';
import { ValidationDomainException } from '../shared/shared/exceptions/validation.domain.exception';

export class CustomerEntityZodValidator implements Validator<Customer> {
  private constructor() {}

  public static create(): Validator<Customer> {
    return new CustomerEntityZodValidator();
  }

  public validate(input: Customer): void {
    try {
      this.getSchema().parse(input);
    } catch (error) {
      let errorMessage: string = '';

      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError;
        errorMessage = ZodUtils.formatZodError(zodError);
      } else {
        errorMessage = `An unexpected error occurred while ${CustomerEntityZodValidator.name}.`;
      }

      throw new ValidationDomainException(
        errorMessage,
        CustomerEntityZodValidator.name,
      );
    }
  }

  private getSchema() {
    const schema = z
      .object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255),
        email: z.string().email(),
        document: z.object({}),
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
      );

    return schema;
  }
}
