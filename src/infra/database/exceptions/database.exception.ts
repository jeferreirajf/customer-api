import { Exception } from '@/shared/exceptions/exception';

export class DatabaseException extends Exception {
  constructor(message: string, context?: string) {
    super(message, context);
    this.name = DatabaseException.name;
  }
}
