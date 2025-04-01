import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../log/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;
    const chunks: Buffer[] = [];

    res.send = function (chunk = '', ...args) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return originalSend.apply(res, [chunk, ...args]);
    };

    res.on('finish', () => {
      const message = `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}
        Request Body: ${JSON.stringify(req.body)}
        Response Status: ${res.statusCode}
        Response Body: ${Buffer.concat(chunks).toString('utf8')}`;

      this.logger.log(message);
    });

    next();
  }
}
