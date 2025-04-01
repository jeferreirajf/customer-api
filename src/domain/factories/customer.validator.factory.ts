import { Customer } from '../entities/customer.entity';
import { Validator } from '../shared/shared/validator/validator';
import { CustomerEntityZodValidator } from '../validators/customer.entity.validator';

export class CustomerValidatorFactory {
  static create(): Validator<Customer> {
    return CustomerEntityZodValidator.create();
  }
}
