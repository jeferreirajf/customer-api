export type HttpResponseErrorProps = {
  message: string;
  statusCode: number;
};

export class HttpResponseError {
  private constructor(
    private readonly message: string,
    private readonly statusCode: number,
  ) {}

  public static create({
    message,
    statusCode,
  }: HttpResponseErrorProps): HttpResponseError {
    return new HttpResponseError(message, statusCode);
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public getMessage(): string {
    return this.message;
  }
}
