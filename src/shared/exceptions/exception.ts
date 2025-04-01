export class Exception extends Error {
  private context?: string;

  constructor(message: string, context?: string) {
    super(message);
    this.context = context;
    this.name = Exception.name;
  }

  public getContext(): string | undefined {
    return this.context;
  }
}
