import { UsecaseException } from './usecase.exception';

export class BadRequestUsecaseException extends UsecaseException {
  constructor(message: string, context?: string) {
    super(message, context);
    this.name = BadRequestUsecaseException.name;
  }
}
