/* eslint-disable no-console */
export class LogHelper {
  public static timeLog(message: string): void {
    console.log(
      message,
    );
  }

  public static log(message: string, timer: string): void {
    // tslint:disable-next-line:no-console
    console.log(message, `${timer} ms`);
  }
}
