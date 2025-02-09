export class MathHelper {
  public static pad(num: number, size: number): string {
    let s: string = num + '';
    while (s.length < size) {
      s = '0' + s;
    }

    return s;
  }
}
