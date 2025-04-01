export class Utils {
  public static GenerateRandomUUID(): string {
    return crypto.randomUUID().toString();
  }

  public static async Sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
