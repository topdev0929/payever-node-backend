export class MathHelper {
  public static pad(num: number, size: number): string {
    let s: string = num + '';
    while (s.length < size) {
      s = '0' + s;
    }

    return s;
  }

  public static componentToHex(c: number): string {
    const hex: string = c.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
  }

  // be sure to always pass a floating point number
  public static toTwoDecimalDigit(num: number): number {
    const numberStr: string = num.toString();

    return parseFloat(numberStr.slice(0, (numberStr.indexOf('.')) + 3));
  }
}
