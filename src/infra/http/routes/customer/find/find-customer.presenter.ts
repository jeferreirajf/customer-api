import { FindByIdCustomerUsecaseOutput } from '@/usecase/customer/find-by-id/find-by-id-customer.usecase';
import { FindCustomerResponse } from './find-customer.dto';

export class FindCustomerPresenter {
  public static toHttp(
    input: FindByIdCustomerUsecaseOutput,
  ): FindCustomerResponse {
    const output: FindCustomerResponse = {
      id: input.id,
      name: input.name,
      email: input.email,
      document: input.document,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    };

    return output;
  }
}
