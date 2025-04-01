import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { NotFoundUsecaseException } from '@/usecase/exceptions/not-found-usecase.exception';
import { Usecase } from '@/usecase/usecase';
import { Injectable } from '@nestjs/common';

export type DeleteCustomerInput = {
  id: string;
};

@Injectable()
export class DeleteCustomerUsecase
  implements Usecase<DeleteCustomerInput, void>
{
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(input: DeleteCustomerInput): Promise<void> {
    const customer = await this.customerRepository.findById(input.id);

    if (!customer) {
      throw new NotFoundUsecaseException(
        `Customer with id ${input.id} not found while ${DeleteCustomerUsecase.name}.`,
        DeleteCustomerUsecase.name,
      );
    }

    await this.customerRepository.delete(customer.getId());
  }
}
