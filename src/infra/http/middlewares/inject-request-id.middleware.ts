import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Utils } from '../../../shared/utils/utils';

@Injectable()
export class InjectRequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = req['requestId'];

    if (!requestId) {
      const uuid = Utils.GenerateRandomUUID();
      req['requestId'] = uuid;
    }

    next();
  }
}
