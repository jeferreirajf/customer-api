import { CustomerRepository } from '@/domain/repositories/customer.repository';
import { DocumentType } from '@/domain/value-objects/document.value-object';
import { NotFoundUsecaseException } from '@/usecase/exceptions/not-found-usecase.exception';
import { Usecase } from '@/usecase/usecase';
import { Injectable } from '@nestjs/common';
import { CustomerType } from '../create/create-customer.usecase';

export type UpdateCustomerInput = {
  id: string;
  name: string;
  email: string;
  document: string;
  customerType: CustomerType;
};

export type UpdateCustomerOutput = {
  id: string;
};

@Injectable()
export class UpdateCustomerUsecase
  implements Usecase<UpdateCustomerInput, UpdateCustomerOutput>
{
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(
    input: UpdateCustomerInput,
  ): Promise<UpdateCustomerOutput> {
    const aCustomer = await this.customerRepository.findById(input.id);

    if (!aCustomer) {
      throw new NotFoundUsecaseException(
        `Customer with id ${input.id} not found while ${UpdateCustomerUsecase.name}.`,
        UpdateCustomerUsecase.name,
      );
    }

    const documentType =
      input.customerType === CustomerType.INDIVIDUAL
        ? DocumentType.CPF
        : DocumentType.CNPJ;

    aCustomer.updateName(input.name);
    aCustomer.updateEmail(input.email);
    aCustomer.updateDocument(input.document, documentType);

    await this.customerRepository.update(aCustomer);

    const output: UpdateCustomerOutput = {
      id: aCustomer.getId(),
    };

    return output;
  }
}
