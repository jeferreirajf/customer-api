import { UpdateCustomerOutput } from '@/usecase/customer/update/update-customer.usecase';
import { UpdateCustomerResponse } from './update-customer.dto';

export class UpdateCustomerPresenter {
  public static toHttp(input: UpdateCustomerOutput): UpdateCustomerResponse {
    const output: UpdateCustomerResponse = {
      id: input.id,
    };

    return output;
  }
}
