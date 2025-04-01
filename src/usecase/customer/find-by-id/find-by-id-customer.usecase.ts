import { Customer } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { NotFoundUsecaseException } from '@/usecase/exceptions/not-found-usecase.exception';
import { Usecase } from '@/usecase/usecase';
import { Injectable } from '@nestjs/common';

export type FindByIdCustomerUsecaseInput = {
  id: string;
};

export type FindByIdCustomerUsecaseOutput = {
  id: string;
  name: string;
  email: string;
  document: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class FindByIdCustomerUsecase
  implements
    Usecase<FindByIdCustomerUsecaseInput, FindByIdCustomerUsecaseOutput>
{
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(
    input: FindByIdCustomerUsecaseInput,
  ): Promise<FindByIdCustomerUsecaseOutput> {
    const customer = await this.customerRepository.findById(input.id);

    if (!customer) {
      throw new NotFoundUsecaseException(
        `Customer with id ${input.id} not found while ${FindByIdCustomerUsecase.name}.`,
        FindByIdCustomerUsecase.name,
      );
    }

    const output = this.toOutput(customer);

    return output;
  }

  private toOutput(customer: Customer): FindByIdCustomerUsecaseOutput {
    const output: FindByIdCustomerUsecaseOutput = {
      id: customer.getId(),
      name: customer.getName(),
      email: customer.getEmail(),
      document: customer.getDocument().getDocument(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    };

    return output;
  }
}
