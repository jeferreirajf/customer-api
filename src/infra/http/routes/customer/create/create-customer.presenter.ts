import { CreateCustomerOutput } from '@/usecase/customer/create/create-customer.usecase';
import { CreateCustomerResponse } from './create-customer.dto';

export class CreateCustomerPresenter {
  public static toHttp(input: CreateCustomerOutput): CreateCustomerResponse {
    const output: CreateCustomerResponse = {
      id: input.id,
    };

    return output;
  }
}
