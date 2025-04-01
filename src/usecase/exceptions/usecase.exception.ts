import { Exception } from '@/shared/exceptions/exception';

export class UsecaseException extends Exception {
  constructor(message: string, context?: string) {
    super(message, context);
    this.name = UsecaseException.name;
  }
}
