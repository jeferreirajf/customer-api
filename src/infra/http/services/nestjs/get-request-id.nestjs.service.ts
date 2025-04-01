import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request as RequestType } from 'express';
import { GetRequestIdService } from '../get-request-id.service';

@Injectable({ scope: Scope.REQUEST })
export class GetRequestIdNestjsService extends GetRequestIdService {
  public constructor(@Inject(REQUEST) private readonly request: RequestType) {
    super();
  }

  public getRequestId(): string {
    const requestId = this.request ? this.request['requestId'] : null;
    return requestId;
  }
}

export const GetRequestIdServiceProvider = {
  provide: GetRequestIdService,
  useClass: GetRequestIdNestjsService,
};
