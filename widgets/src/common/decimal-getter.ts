export class DecimalGetter {
  public static get(value: any): number {
    return Number(value.toString());
  }
}
