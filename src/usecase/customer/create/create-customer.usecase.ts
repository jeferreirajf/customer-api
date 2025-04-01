import { Customer } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { BadRequestUsecaseException } from '@/usecase/exceptions/bad-request-usecase.exception';
import { Usecase } from '@/usecase/usecase';
import { Injectable } from '@nestjs/common';

export enum CustomerType {
  INDIVIDUAL = 'individual',
  LEGAL = 'legal',
}

export type CreateCustomerInput = {
  name: string;
  email: string;
  document: string;
  customerType: CustomerType;
};

export type CreateCustomerOutput = {
  id: string;
};

@Injectable()
export class CreateCustomerUsecase
  implements Usecase<CreateCustomerInput, CreateCustomerOutput>
{
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(
    input: CreateCustomerInput,
  ): Promise<CreateCustomerOutput> {
    const aCustomer = this.createCustomer(input);

    await this.customerRepository.create(aCustomer);

    const output: CreateCustomerOutput = {
      id: aCustomer.getId(),
    };

    return output;
  }

  private createCustomer(input: CreateCustomerInput): Customer {
    if (input.customerType === CustomerType.INDIVIDUAL) {
      const aCustomer = Customer.createIndividualCustomer({
        name: input.name,
        email: input.email,
        document: input.document,
      });

      return aCustomer;
    }

    if (input.customerType === CustomerType.LEGAL) {
      const aCustomer = Customer.createLegalCustomer({
        name: input.name,
        email: input.email,
        document: input.document,
      });

      return aCustomer;
    }

    throw new BadRequestUsecaseException(
      `Customer type ${input.customerType} is not valid while ${CreateCustomerUsecase.name}`,
      CreateCustomerUsecase.name,
    );
  }
}
