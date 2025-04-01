export class JestUtils {
  /**
   * Expect error.
   * @description This method is used to assert that a function throws an error of a specific type and with a specific message.
   * @param fn Function that should throw an error
   * @param errorType Type of the error that should be thrown
   * @param errorMessage Message that should be contained in the error
   */
  public static expectError<T extends Error>(
    fn: () => void,
    errorType: new (message: string, context?: string) => T,
    errorMessage: string,
  ) {
    expect(fn).toThrow(
      expect.objectContaining({
        name: errorType.name,
        message: expect.stringContaining(errorMessage),
      }),
    );
  }

  public static async expectErrorAsync<T extends Error>(
    fn: () => Promise<void>,
    errorType: new (message: string, context?: string) => T,
    errorMessage: string,
  ) {
    await expect(fn).rejects.toThrow(
      expect.objectContaining({
        name: errorType.name,
        message: expect.stringContaining(errorMessage),
      }),
    );
  }

  public static async expectErrorWithReturnAsync<T extends Error, Output>(
    fn: () => Promise<Output>,
    errorType: new (message: string, context?: string) => T,
    errorMessage: string,
  ) {
    await expect(fn).rejects.toThrow(
      expect.objectContaining({
        name: errorType.name,
        message: expect.stringContaining(errorMessage),
      }),
    );
  }

  public static async wait(ms: number = 100) {
    await Promise.resolve(
      await new Promise((resolve) => setTimeout(resolve, ms)),
    );
  }

  public static getUUIDRegex() {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  }
}
