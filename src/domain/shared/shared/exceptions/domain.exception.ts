import { Exception } from '@/shared/exceptions/exception';

export class DomainException extends Exception {
  constructor(message: string, context?: string) {
    super(message, context);
    this.name = DomainException.name;
  }
}
