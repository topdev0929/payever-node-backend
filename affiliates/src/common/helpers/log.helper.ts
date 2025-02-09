export class LogHelper {
  public static timeLog(message: string): void {
    // eslint-disable-next-line no-console
    console.log(message);
  }

  public static log(message: string, timer: string): void {
    // eslint-disable-next-line no-console
    console.log(message, `${timer} ms`);
  }
}
